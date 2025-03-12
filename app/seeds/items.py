from app.models import db, environment, SCHEMA, Item
from sqlalchemy.sql import text



def seed_items():
    items = [
        # Breakfast Items (menu_id=1)
        Item(name="Barnacle Breakfast Sandwich", price=4.99, menu_id=1, category="Breakfast"),
        Item(name="Bubble Bass Omelette", price=5.49, menu_id=1, category="Breakfast"),
        Item(name="Jellyfish Jelly Toast", price=3.49, menu_id=1, category="Breakfast"),
        Item(name="Seanut Butter Pancakes", price=5.99, menu_id=1, category="Breakfast"),
        Item(name="Captain Magma Coffee", price=2.99, menu_id=1, category="Drinks"),
        Item(name="Sea Oatmeal Bowl", price=3.99, menu_id=1, category="Breakfast"),
        Item(name="Coral Hash Browns", price=2.99, menu_id=1, category="Breakfast"),
        Item(name="Anchovy Morning Wrap", price=5.49, menu_id=1, category="Breakfast"),
        Item(name="Krusty Krab Benedict", price=6.99, menu_id=1, category="Breakfast"),
        Item(name="Salty Sea Biscuit", price=1.99, menu_id=1, category="Breakfast"),

        # Lunch Items (menu_id=2)
        Item(name="Krabby Patty", price=3.99, menu_id=2, category="Lunch"),
        Item(name="Double Krabby Patty", price=5.99, menu_id=2, category="Lunch"),
        Item(name="Kelp Rings", price=2.99, menu_id=2, category="Lunch"),
        Item(name="Coral Fries", price=2.49, menu_id=2, category="Lunch"),
        Item(name="Kelp Shake", price=4.99, menu_id=2, category="Lunch"),
        Item(name="Seafoam Soda", price=3.49, menu_id=2, category="Lunch"),
        Item(name="Pretty Patty", price=4.49, menu_id=2, category="Lunch"),
        Item(name="Bubble Nuggets", price=3.99, menu_id=2, category="Lunch"),
        Item(name="Sailor's Salad", price=4.99, menu_id=2, category="Lunch"),
        Item(name="Fried Oyster Skins", price=3.99, menu_id=2, category="Lunch"),

        # Dinner Items (menu_id=3)
        Item(name="Triple Krabby Supreme", price=7.99, menu_id=3, category="Dinner"),
        Item(name="Krabby Deluxe", price=6.99, menu_id=3, category="Dinner"),
        Item(name="Coral Bits", price=3.49, menu_id=3, category="Dinner"),
        Item(name="Salty Sea Dog", price=4.99, menu_id=3, category="Dinner"),
        Item(name="Sa-lad", price=4.49, menu_id=3, category="Dinner"),
        Item(name="Captain's Platter", price=9.99, menu_id=3, category="Dinner"),
        Item(name="Mermaid Man Chili", price=4.99, menu_id=3, category="Dinner"),
        Item(name="Neptune’s Fish & Chips", price=7.99, menu_id=3, category="Dinner"),
        Item(name="Golden Loaf", price=2.49, menu_id=3, category="Dinner"),
        Item(name="Atlantis Ale", price=3.99, menu_id=3, category="Dinner")
    ]

    db.session.add_all(items)
    db.session.commit()


def undo_items():
    """
    Removes all items from the database.

    In production (Postgres), truncates the items table and resets identity.
    TRUNCATE removes all data from the table.
    RESET IDENTITY resets the auto-incrementing PK.
    CASCADE deletes any dependent entities.

    In development (SQLite), DELETE removes all data and resets the PKs.
    """
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE')
    else:
        db.session.execute(text("DELETE FROM items"))

    db.session.commit()