# cap/app/api/order_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Order

order_routes = Blueprint('orders', __name__)

# GET: Get all orders (for today, coming soon. gotta have some kind of pagination here)
@order_routes.route('/', methods=['GET'])
@login_required
def get_orders():
    """
    Query for all orders and returns them in a list of user dictionaries
    """
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

# POST: Add a new order to list of orders
@order_routes.route('/<int:id>', methods=['POST'])
@login_required
def add_order():
    data = request.get_json()
    new_order = Order(
        krustomer=data["krustomer"], 
        total_price=data["total_price"], 
        menu_item_id=data["menu_item_id"],
        status=data.get("status", "pending"))
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

# PUT: Update a paid order
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