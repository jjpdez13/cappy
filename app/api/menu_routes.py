# cap/app/api/menu_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Menu

menu_routes = Blueprint('menus', __name__)

# GET: Get all menu categories
@menu_routes.route('/', methods=['GET'])
@login_required
def get_menu():

    menus = Menu.query.all()
    return jsonify([menu.to_dict() for menu in menus]), 200

# POST: Add a new menu category
@menu_routes.route('/', methods=['POST'])
@login_required
def add_menu():
    data = request.get_json()
    new_menu = Menu(name=data["name"])
    db.session.add(new_menu)
    db.session.commit()
    return jsonify(new_menu.to_dict()), 201

# PUT: Update an existing menu category
@menu_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_menu(id):
    menu = Menu.query.get(id)
    if not menu:
        return jsonify({"error": "Menu category not found"}), 404
    data = request.get_json()
    menu.name = data.get("name", menu.name)
    db.session.commit()
    return jsonify(menu.to_dict()), 200

# DELETE: Delete a category from the menu
@menu_routes.route('/<int:id>', methods=["DELETE"])
def delete_menu(id):
    menu = Menu.query.get(id)
    if not menu:
        return jsonify({"error": "Menu category not found"}), 404
    db.session.delete(menu)
    db.session.commit()
    return jsonify({"message": "Menu category deleted"}), 200