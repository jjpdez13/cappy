from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def employee_exists(field):
    # Checking if employee exists
    employee_id = field.data
    employee = User.query.filter(User.employee_id == employee_id).first()
    if employee:
        raise ValidationError('Employee already exists in database.')


class SignUpForm(FlaskForm):
    employee_id = StringField('employee_id', validators=[DataRequired(), employee_exists])
    password = StringField('password', validators=[DataRequired()])
