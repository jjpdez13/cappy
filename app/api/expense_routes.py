from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from werkzeug.security import check_password_hash
from app.models import db, Expense, User

expense_routes = Blueprint('expenses', __name__)

# GET all expenses
@expense_routes.route('/', methods=['GET'])
@login_required
def get_expenses():
    if current_user.role != "Admin":
        return jsonify({"error": "Unauthorized"}), 403

    expenses = Expense.query.order_by(Expense.created_at.desc()).all()
    return jsonify([e.to_dict() for e in expenses]), 200

# POST new expense
@expense_routes.route('/', methods=['POST'])
@login_required
def add_expense():
    if current_user.role != "Admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    new_expense = Expense(
        category=data["category"],
        amount=data["amount"],
        description=data.get("description", "")
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201

# PUT update expense
@expense_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_expense(id):
    if current_user.role != "Admin":
        return jsonify({"error": "Unauthorized"}), 403

    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json()
    expense.category = data.get("category", expense.category)
    expense.amount = data.get("amount", expense.amount)
    expense.description = data.get("description", expense.description)

    db.session.commit()
    return jsonify(expense.to_dict()), 200

# DELETE expense — requires SpongeBob’s password
@expense_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_expense(id):
    if current_user.role != "Admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    spongebob_pw = data.get("spongebob_password")

    spongebob = User.query.filter_by(username="MuscleBob300").first()
    if not spongebob or not check_password_hash(spongebob.hashed_password, spongebob_pw):
        return jsonify({"error": "SpongeBob's password is incorrect"}), 401

    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200