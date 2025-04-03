from app.models import db, Expense, Supply, environment, SCHEMA
from sqlalchemy.sql import text

def seed_expenses():
    supplies = Supply.query.all()
    total_supply_cost = sum(s.cost for s in supplies)

    expenses = [
        Expense(category="Labor costs", amount=3200, description="Wages for staff"),
        Expense(category="Utilities", amount=3000, description="General utility costs"),
        Expense(category="Property taxes", amount=7000, description="Oceanfront property taxes"),
        Expense(category="Water", amount=800, description="Monthly water bill"),
        Expense(category="Electricity", amount=1500, description="Power for grills, fryers, lights"),
        Expense(category="Gas for cooking", amount=1200, description="Gas supply for kitchen"),
        Expense(category="Cleaning supplies", amount=600, description="Janitorial products"),
        Expense(category="Advertising", amount=1000, description="Flyers, Sea Times ads"),
        Expense(category="Security measures", amount=500, description="Bouncer and anchovy guards"),
        Expense(category="Repairs", amount=1000, description="Maintenance and plumbing fixes"),
        Expense(category="Cooking equipment maintenance", amount=700, description="Grill, fryer, spatula service"),
        Expense(category="Food waste", amount=1500, description="Spoilage and scraps"),
        Expense(category="Packaging costs", amount=1000, description="To-go bags, boxes"),
        Expense(category="Name tags", amount=50, description="Employee name tags"),
        Expense(category="Supplies", amount=total_supply_cost, description="Total monthly cost from supply seed")
    ]

    db.session.add_all(expenses)
    db.session.commit()

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))
    db.session.commit()