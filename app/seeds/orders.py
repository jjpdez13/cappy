from app.models import db, environment, SCHEMA, Order, Item
from sqlalchemy.sql import text


def seed_orders():
    # Fetch menu items to assign to orders
    krabby_patty = Item.query.filter_by(name="Krabby Patty").first()
    kelp_shake = Item.query.filter_by(name="Kelp Shake").first()
    coral_fries = Item.query.filter_by(name="Coral Fries").first()

    order_sandy = Order(
    krustomer_name="Sandy Cheeks",
    status="pending"
    )
    order_sandy.items.append(krabby_patty)

    order_larry = Order(
    krustomer_name="Larry Lobster",
    status="pending"
    )
    order_larry.items.append(kelp_shake)

    order_plankton = Order(
    krustomer_name="Plankton",
    status="failed"
    )
    order_plankton.items.append(krabby_patty)  # He tries to order but gets denied. LOL

    order_patrick = Order(
    krustomer_name="Patrick Star",
    status="pending"
    )
    order_patrick.items.append(coral_fries)

    db.session.add_all([order_sandy, order_larry, order_plankton, order_patrick])
    db.session.commit()


def undo_orders():
    """
    Removes all orders from the database.

    In production (Postgres), truncates the orders table and resets identity.
    TRUNCATE removes all data from the table.
    RESET IDENTITY resets the auto-incrementing PK.
    CASCADE deletes any dependent entities.

    In development (SQLite), DELETE removes all data and resets the PKs.
    """
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.orders RESTART IDENTITY CASCADE')
    else:
        db.session.execute(text("DELETE FROM orders"))

    db.session.commit()