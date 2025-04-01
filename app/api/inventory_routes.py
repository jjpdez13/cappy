from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Inventory

inventory_routes = Blueprint('inventory', __name__)

# GET: Get all inventory items
@inventory_routes.route('/', methods=['GET'])
@login_required
def get_inventory():
    inventory_items = Inventory.query.all()
    return jsonify([item.to_dict() for item in inventory_items]), 200

# POST: Add a new inventory item
@inventory_routes.route('/', methods=['POST'])
@login_required
def add_inventory():
    data = request.get_json()
    new_item = Inventory(
        name=data["name"],
        quantity=data.get("quantity", 0),
        cost=data.get("cost", 0.0)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

# PUT: Update an existing inventory item
@inventory_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_inventory(id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"error": "Inventory item not found"}), 404
    data = request.get_json()
    item.name = data.get("name", item.name)
    item.quantity = data.get("quantity", item.quantity)
    item.cost = data.get("cost", item.cost)
    db.session.commit()
    return jsonify(item.to_dict()), 200

# DELETE: Delete an inventory item
@inventory_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_inventory(id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"error": "Inventory item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Inventory item deleted"}), 200

# PATCH: Reduce inventory (e.g., when an order is completed)
@inventory_routes.route('/<int:id>/reduce', methods=['PATCH'])
@login_required
def reduce_inventory(id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"error": "Inventory item not found"}), 404

    data = request.get_json()
    reduce_by = data.get("amount", 0)
    if reduce_by < 0:
        return jsonify({"error": "Reduction amount must be positive"}), 400

    if item.quantity < reduce_by:
        return jsonify({"error": "Insufficient inventory"}), 400

    item.quantity -= reduce_by
    db.session.commit()
    return jsonify(item.to_dict()), 200

# PATCH: Bulk reduce inventory (e.g., after a large order or anchovy rush)
@inventory_routes.route('/bulk-reduce', methods=['PATCH'])
@login_required
def bulk_reduce_inventory():
    data = request.get_json()  # Expecting a list of {id, amount}
    errors = []
    updated_items = []

    for entry in data:
        item_id = entry.get("id")
        reduce_by = entry.get("amount", 0)

        item = Inventory.query.get(item_id)
        if not item:
            errors.append({"id": item_id, "error": "Item not found"})
            continue

        if reduce_by < 0:
            errors.append({"id": item_id, "error": "Negative reduction not allowed"})
            continue

        if item.quantity < reduce_by:
            errors.append({"id": item_id, "error": "Insufficient inventory"})
            continue

        item.quantity -= reduce_by
        updated_items.append(item.to_dict())

    db.session.commit()
    return jsonify({"updated": updated_items, "errors": errors}), 200