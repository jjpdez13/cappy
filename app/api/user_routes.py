from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

# Profile routes
@user_routes.route("/profile", methods=["GET"])
@login_required
def get_profile():
    user = current_user
    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    })

@user_routes.route("/profile", methods=["PUT"])
@login_required
def update_profile():
    data = request.json
    user = current_user

    # Check if any fields were provided, otherwise use existing values
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)

    try:
        db.session.commit()
        return jsonify({
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


