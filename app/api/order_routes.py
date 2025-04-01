# cap/app/api/order_routes.py
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Order, Item, order_items, SupplyItem, Supply
from sqlalchemy import select

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
    if "item_ids" not in data or not isinstance(data["item_ids"], list):
        return jsonify({"error": "item_ids must be a list of item IDs"}), 400

    new_items = Item.query.filter(Item.id.in_(data["item_ids"])).all()
    if not new_items:
        return jsonify({"error": "No valid items found"}), 400

    for item in new_items:
        # 🛠️ Check if this item is already in the order
        existing_entry = db.session.query(order_items).filter_by(order_id=id, item_id=item.id).first()

        if existing_entry:
            # ✅ If the item exists, just increase the quantity
            existing_entry.quantity += 1
        else:
            # ✅ Otherwise, add a new row
            db.session.execute(
                order_items.insert().values(order_id=id, item_id=item.id, quantity=1)
            )

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

    new_order = Order(
        krustomer_name=data["krustomer_name"],
        status="pending"
    )
    db.session.add(new_order)
    db.session.commit()

    for item in data["items"]:
        existing = db.session.execute(
            select(order_items.c.quantity).where(
                order_items.c.order_id == new_order.id,
                order_items.c.item_id == item["item_id"]
            )
        ).fetchone()

        if existing:
            db.session.execute(
                order_items.update()
                .where(
                    order_items.c.order_id == new_order.id,
                    order_items.c.item_id == item["item_id"]
                )
                .values(quantity=existing.quantity + item.get("quantity", 1))
            )
        else:
            db.session.execute(
                order_items.insert().values(
                    order_id=new_order.id,
                    item_id=item["item_id"],
                    quantity=item.get("quantity", 1)
                )
            )

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

# POST: Update order items quantity
@order_routes.route('/<int:order_id>/update-quantity', methods=['POST'])
@login_required
def update_order_item_quantity(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json()
    item_id = data.get("item_id")
    change = data.get("change", 1)  # Default to +1, can also be -1 for decreasing

    if not item_id:
        return jsonify({"error": "Missing item_id"}), 400

    existing_item = db.session.query(order_items).filter_by(order_id=order_id, item_id=item_id).first()

    if existing_item:
        new_quantity = max(1, existing_item.quantity + change)  # Ensure quantity never drops below 1
        db.session.execute(
            order_items.update()
            .where(order_items.c.order_id == order_id, order_items.c.item_id == item_id)
            .values(quantity=new_quantity)
        )
    else:
        db.session.execute(
            order_items.insert().values(order_id=order_id, item_id=item_id, quantity=1)
        )

    db.session.commit()
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

# PATCH: Mark an order as complete and reduce supplies
@order_routes.route('/<int:id>/complete', methods=["PATCH"])
@login_required
def complete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    if order.status == "completed":
        return jsonify({"error": "Order is already completed"}), 400

    reduction_map = {}

    for item in order.items:
        quantity = db.session.query(order_items.c.quantity).filter_by(
            order_id=order.id,
            item_id=item.id
        ).scalar()

        for link in item.supply_links:
            supply = link.supply
            total_used = link.amount_used * quantity

            if supply.id in reduction_map:
                reduction_map[supply.id]["amount"] += total_used
            else:
                reduction_map[supply.id] = {
                    "supply": supply,
                    "amount": total_used
                }

    # Validate inventory levels
    for entry in reduction_map.values():
        if entry["supply"].quantity < entry["amount"]:
            return jsonify({
                "error": f"Not enough {entry['supply'].name} in stock"
            }), 400

    # Reduce supply quantities
    for entry in reduction_map.values():
        entry["supply"].quantity -= entry["amount"]

    order.status = "completed"
    db.session.commit()

    return jsonify(order.to_dict()), 200