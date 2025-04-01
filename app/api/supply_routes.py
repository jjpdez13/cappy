from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Supply

supply_routes = Blueprint('supply', __name__)

# GET: Get all supply items
@supply_routes.route('/', methods=['GET'])
@login_required
def get_supply():
    supply_items = Supply.query.all()
    return jsonify([item.to_dict() for item in supply_items]), 200

# POST: Add a new supply item
@supply_routes.route('/', methods=['POST'])
@login_required
def add_supply():
    data = request.get_json()
    new_item = Supply(
        name=data["name"],
        quantity=data.get("quantity", 0),
        cost=data.get("cost", 0.0)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

# PUT: Update an existing supply item
@supply_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_supply(id):
    item = Supply.query.get(id)
    if not item:
        return jsonify({"error": "Supply item not found"}), 404
    data = request.get_json()
    item.name = data.get("name", item.name)
    item.quantity = data.get("quantity", item.quantity)
    item.cost = data.get("cost", item.cost)
    db.session.commit()
    return jsonify(item.to_dict()), 200

# DELETE: Delete an supply item
@supply_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_supply(id):
    item = Supply.query.get(id)
    if not item:
        return jsonify({"error": "Supply item not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Supply item deleted"}), 200

# PATCH: Reduce supply (e.g., when an order is completed)
@supply_routes.route('/<int:id>/reduce', methods=['PATCH'])
@login_required
def reduce_supply(id):
    item = Supply.query.get(id)
    if not item:
        return jsonify({"error": "Supply item not found"}), 404

    data = request.get_json()
    reduce_by = data.get("amount", 0)
    if reduce_by < 0:
        return jsonify({"error": "Reduction amount must be positive"}), 400

    if item.quantity < reduce_by:
        return jsonify({"error": "Insufficient supply"}), 400

    item.quantity -= reduce_by
    db.session.commit()
    return jsonify(item.to_dict()), 200

# PATCH: Bulk reduce supply (e.g., after a large order or anchovy rush)
@supply_routes.route('/bulk-reduce', methods=['PATCH'])
@login_required
def bulk_reduce_supply():
    data = request.get_json()  # Expecting a list of {id, amount}
    errors = []
    updated_items = []

    for entry in data:
        item_id = entry.get("id")
        reduce_by = entry.get("amount", 0)

        item = Supply.query.get(item_id)
        if not item:
            errors.append({"id": item_id, "error": "Item not found"})
            continue

        if reduce_by < 0:
            errors.append({"id": item_id, "error": "Negative reduction not allowed"})
            continue

        if item.quantity < reduce_by:
            errors.append({"id": item_id, "error": "Insufficient supply"})
            continue

        item.quantity -= reduce_by
        updated_items.append(item.to_dict())

    db.session.commit()
    return jsonify({"updated": updated_items, "errors": errors}), 200