from app.models import db, environment, SCHEMA, Menu
from sqlalchemy.sql import text


def seed_menus():
    brekky = Menu(name="Breakfast")
    lunch = Menu(name="Lunch")
    dindin = Menu(name="Dinner")

    db.session.add_all([brekky, lunch, dindin])
    db.session.commit()


def undo_menus():
    """
    Removes all menu categories from the database.

    In production (Postgres), truncates the menus table and resets identity.
    TRUNCATE removes all data from the table.
    RESET IDENTITY resets the auto-incrementing PK.
    CASCADE deletes any dependent entities.

    In development (SQLite), DELETE removes all data and resets the PKs.
    """
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.menus RESTART IDENTITY CASCADE')
    else:
        db.session.execute(text("DELETE FROM menus"))

    db.session.commit()