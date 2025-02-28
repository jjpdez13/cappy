# cap/app/api/item_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Item

item_routes = Blueprint('items', __name__)

# GET: Get all items in a menu category
@item_routes.route('/', methods=['GET'])
@login_required
def get_items():
    """
    Query for all items and returns them in a list of user dictionaries
    """
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

# POST: Add a new item to a menu category
@item_routes.route('/', methods=['POST'])
@login_required
def add_item():
    data = request.get_json()
    new_item = Item(name=data["name"])
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

# DELETE: Delete an item from the menu category
@item_routes.route('/<int:id>', methods=["DELETE"])
def delete_item(id):
    item = Item.query.get(id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Menu category deleted"}), 200