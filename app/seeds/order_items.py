from app.models import db, environment, SCHEMA

def undo_order_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.order_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM order_items")
    db.session.commit()