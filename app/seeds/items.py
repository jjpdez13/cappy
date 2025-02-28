from app.models import db, environment, SCHEMA, Item
from sqlalchemy.sql import text


def seed_items():
    legend = Item(name="Krabby Patty", price=3.99, menu_id=1, category="Burgers")
    dubLeggie = Item(name="Double Krabby Patty", price=5.99, menu_id=2, category="Burgers")
    tripLeg = Item(name="Triple Krabby Supreme", price=7.99, menu_id=3, category="Burgers")
    rings = Item(name="Kelp Rings", price=2.99, menu_id=3, category="Sides")
    fries = Item(name="Coral Fries", price=2.49, menu_id=2, category="Sides")
    shake = Item(name="Kelp Shake", price=4.99, menu_id=2, category="Drinks")
    soda = Item(name="Seafoam Soda", price=3.49, menu_id=1, category="Drinks")


    db.session.add_all([
        legend, dubLeggie, tripLeg, rings, fries, shake, soda,
    ])
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