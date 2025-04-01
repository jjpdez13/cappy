from app.models import db, Item, Supply, SupplyItem, environment, SCHEMA
from sqlalchemy.sql import text

def seed_supply_items():
    items = {item.name: item for item in Item.query.all()}
    supplies = {supply.name: supply for supply in Supply.query.all()}

    mappings = [
        # Krabby Patty
        ("Krabby Patty", [
            ("Buns", 1),
            ("Krabby Patties", 1),
            ("Lettuce", 1),
            ("Tomato", 1),
            ("Pickles", 1),
            ("Onions", 1),
            ("Condiments (ketchup, mustard, mayo)", 1),
        ]),
        # Pretty Patty
        ("Pretty Patty", [
            ("Buns", 1),
            ("Painted Meat (Pretty Patties)", 1),
            ("Lettuce", 1),
            ("Condiments (ketchup, mustard, mayo)", 1),
        ]),
        # Coral Fries
        ("Coral Fries", [
            ("Coral Fries", 1),
            ("Frying Oil", 0.1),
        ]),
        # Kelp Rings
        ("Kelp Rings", [
            ("Kelp Rings (fried)", 1),
            ("Frying Oil", 0.1),
        ]),
        # Bubble Nuggets
        ("Bubble Nuggets", [
            ("Bubble Nuggets (require bubble bottles)", 1),
            ("Frying Oil", 0.2),
            ("Bubble Bottles (for nuggets, burgers, and parfaits)", 1),
        ]),
        # Fried Oyster Skins
        ("Fried Oyster Skins", [
            ("Fried Oyster Skins", 1),
            ("Frying Oil", 0.1),
        ]),
        # Kelp Shake
        ("Kelp Shake", [
            ("Kelp Shake Mix", 1),
        ]),
        # Seafoam Soda
        ("Seafoam Soda", [
            ("Soft Drinks Syrup (cola, orange, grape)", 1),
            ("Seafoam Syrup (for Seafoam Soda)", 1),
            ("CO₂ (carbonation)", 1),
        ]),
    ]

    for item_name, ingredients in mappings:
        item = items.get(item_name)
        if not item:
            continue
        for supply_name, amount in ingredients:
            supply = supplies.get(supply_name)
            if supply:
                db.session.add(SupplyItem(item_id=item.id, supply_id=supply.id, amount_used=amount))

    db.session.commit()


def undo_supply_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.supply_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM supply_items"))

    db.session.commit()