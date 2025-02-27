from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    id = field.data
    user = User.query.filter(User.id == id).first()
    if not user:
        raise ValidationError('id provided not found.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    id = form.data['id']
    user = User.query.filter(User.id == id).first()
    if not user:
        raise ValidationError('No such user exists.')
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):
    id = StringField('id', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), password_matches])