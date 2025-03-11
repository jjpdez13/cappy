from flask import Blueprint, request, jsonify, make_response
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthenticated'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        if user and check_password_hash(user.hashed_password, form.data['password']):
            login_user(user)
            return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    
    print("CSRF Token:", request.cookies.get('csrf_token'))  
    received_data = request.get_json()
    print("🔥 Received Data from Frontend:", received_data) 
    
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if not form.validate_on_submit():
        return jsonify({"errors": form.errors}), 401
    
    existing_user = User.query.filter((User.email == form.data['email']) | (User.username == form.data['username'])).first()
    if existing_user:
        errors = {}
        if existing_user.email == form.data['email']:
            errors["email"] = "Email is already in use."
        if existing_user.username == form.data['username']:
            errors["username"] = "Username is already taken."
        return jsonify({"errors": errors}), 401

    hashed_password = generate_password_hash(form.data['password'])
    
    if form.validate_on_submit():
            user = User(
                first_name=form.data['first_name'],
                last_name=form.data['last_name'],
                username=form.data['username'],
                email=form.data['email'],
                hashed_password=hashed_password,
                role=form.data.get('role', "Employee")
            )
            db.session.add(user)
            db.session.commit()
            login_user(user)
            response = user.to_dict(), 201
            return response
    return jsonify({"errors": form.errors}), 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401