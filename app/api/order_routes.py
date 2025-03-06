# cap/app/api/order_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Order, Item

order_routes = Blueprint('orders', __name__)

# GET: Get all orders (for today, coming soon. gotta have some kind of pagination here)
@order_routes.route('/', methods=['GET'])
@login_required
def get_orders():

    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

# POST: Add items to an existing order
@order_routes.route('/<int:id>', methods=['POST'])
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

# DELETE: Remove items from an existing order
@order_routes.route('/<int:id>/remove-items', methods=['DELETE'])
@login_required
def remove_items_from_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()

    # Validate input
    if "item_ids" not in data or not isinstance(data["item_ids"], list):
        return jsonify({"error": "item_ids must be a list of item IDs"}), 400

    # Filter out the items that are currently in the order
    items_to_remove = [item for item in order.items if item.id in data["item_ids"]]

    if not items_to_remove:
        return jsonify({"error": "No matching items found in order"}), 400

    # Remove the items
    for item in items_to_remove:
        order.items.remove(item)

    db.session.commit()

    return jsonify(order.to_dict()), 200


# POST: Add a new order to the list of orders
@order_routes.route('/', methods=['POST'])
@login_required
def add_order():
    data = request.get_json()


    if "item_ids" not in data or not isinstance(data["item_ids"], list):
        return jsonify({"error": "item_ids must be a list of item IDs"}), 400


    items = Item.query.filter(Item.id.in_(data["item_ids"])).all()

    if not items:
        return jsonify({"error": "No valid items found"}), 400

    new_order = Order(
        krustomer_name=data.get("krustomer_name", "Krustomer"),
        status=data.get("status", "pending")
    )

    new_order.items.extend(items)

    db.session.add(new_order)
    db.session.commit()

    return jsonify(new_order.to_dict()), 201

# GET: Get details of a specific order
@order_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.to_dict()), 200

# PUT: Update a paid order from "pending" to "completed"
@order_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    data = request.get_json()
    order.status = data.get("status", order.status)
    db.session.commit()
    return jsonify(order.to_dict()), 200

# DELETE: Delete an order
@order_routes.route('/<int:id>', methods=["DELETE"])
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200