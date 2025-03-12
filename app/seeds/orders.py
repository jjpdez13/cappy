from app.models import db, environment, SCHEMA, Order, Item, order_items
from sqlalchemy.sql import text

def seed_orders():
    items = {item.name: item for item in Item.query.all()}

    orders_data = [
        # Breakfast Orders
        {"krustomer_name": "SpongeBob SquarePants", "items": [("Barnacle Breakfast Sandwich", 1)]},
        {"krustomer_name": "Squilliam Fancyson", "items": [("Seanut Butter Pancakes", 2), ("Captain Magma Coffee", 1), ("Coral Hash Browns", 1)]},
        {"krustomer_name": "Old Man Jenkins", "items": [("Jellyfish Jelly Toast", 3), ("Salty Sea Biscuit", 2)]},
        {"krustomer_name": "King Neptune", "items": [("Krusty Krab Benedict", 1), ("Anchovy Morning Wrap", 2)]},
        {"krustomer_name": "Bubble Bass", "items": [("Bubble Bass Omelette", 4), ("Captain Magma Coffee", 3), ("Sea Oatmeal Bowl", 2), ("Coral Hash Browns", 1)]},

        # Lunch Orders
        {"krustomer_name": "Patrick Star", "items": [("Krabby Patty", 5)]},
        {"krustomer_name": "Squidward Tentacles", "items": [("Double Krabby Patty", 2), ("Kelp Shake", 1)]},
        {"krustomer_name": "Pearl Krabs", "items": [("Pretty Patty", 1), ("Bubble Nuggets", 3), ("Seafoam Soda", 1)]},
        {"krustomer_name": "Karen", "items": [("Kelp Rings", 2)]},
        {"krustomer_name": "Mrs. Puff", "items": [("Sailor's Salad", 1), ("Coral Fries", 2), ("Fried Oyster Skins", 1), ("Seafoam Soda", 2)]},

        # Dinner Orders
        {"krustomer_name": "Larry Lobster", "items": [("Triple Krabby Supreme", 1), ("Atlantis Ale", 2), ("Golden Loaf", 1)]},
        {"krustomer_name": "Fred Mileg", "items": [("Captain's Platter", 1)]},
        {"krustomer_name": "Harold SquarePants", "items": [("Neptune’s Fish & Chips", 2), ("Sa-lad", 1)]},
        {"krustomer_name": "Mermaid Man", "items": [("Mermaid Man Chili", 2), ("Krabby Deluxe", 1), ("Coral Bits", 1), ("Atlantis Ale", 1)]},
        {"krustomer_name": "Barnacle Boy", "items": [("Salty Sea Dog", 2), ("Golden Loaf", 3)]},
    ]

    for order_data in orders_data:
        new_order = Order(krustomer_name=order_data["krustomer_name"], status="pending")
        db.session.add(new_order)
        db.session.commit()

        for item_name, qty in order_data["items"]:
            item = items.get(item_name)
            if item:
                db.session.execute(
                    order_items.insert().values(
                        order_id=new_order.id,
                        item_id=item.id,
                        quantity=qty
                    )
                )

    db.session.commit()

def undo_orders():
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE;')
        db.session.execute(f'TRUNCATE table {SCHEMA}.order_items RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text("DELETE FROM order_items"))
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()