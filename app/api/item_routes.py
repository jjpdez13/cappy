# cap/app/api/item_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Item, Order

item_routes = Blueprint('items', __name__)

# GET: Get all items in a menu category
@item_routes.route('/', methods=['GET'])
@login_required
def get_items():

    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

# POST: Add items to an existing order
@item_routes.route('/<int:id>', methods=['POST'])
@login_required
def add_to_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()

    # Validate input
    if "item_ids" not in data or not isinstance(data["item_ids"], list):
        return jsonify({"error": "item_ids must be a list of item IDs"}), 400

    # Query items based on the list of item_ids
    new_items = Item.query.filter(Item.id.in_(data["item_ids"])).all()

    if not new_items:
        return jsonify({"error": "No valid items found"}), 400

    # Add new items to the existing order
    order.items.extend(new_items)
    db.session.commit()

    return jsonify(order.to_dict()), 200

# POST: Add a new item to a menu category
@item_routes.route('/', methods=['POST'])
@login_required
def add_item():
    data = request.get_json()
    new_item = Item(
        menu_id=data["menu_id"],
        name=data["name"], 
        price=data["price"],
        category=data["category"],
        is_active=data.get("is_active", True)
        )
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
    return jsonify({"message": "Menu item deleted"}), 200