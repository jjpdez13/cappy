from app.models import db, Supply, environment, SCHEMA
from sqlalchemy.sql import text

def seed_supplies():
    supplies = [
        Supply(name="Krabby Patties", quantity=500, cost=3000),
        Supply(name="Buns", quantity=1000, cost=1500),
        Supply(name="Lettuce", quantity=800, cost=500),
        Supply(name="Tomato", quantity=700, cost=600),
        Supply(name="Pickles", quantity=600, cost=400),
        Supply(name="Onions", quantity=500, cost=300),
        Supply(name="Cheese", quantity=900, cost=1200),
        Supply(name="Condiments (ketchup, mustard, mayo)", quantity=1000, cost=800),
        Supply(name="Frying Oil", quantity=200, cost=1000),
        Supply(name="French Fries", quantity=1000, cost=2500),
        Supply(name="Kelp Rings (fried)", quantity=600, cost=1000),
        Supply(name="Coral Fries", quantity=700, cost=900),
        Supply(name="Coral Bits (tiny crispy coral pieces)", quantity=800, cost=700),
        Supply(name="Bubble Nuggets (require bubble bottles)", quantity=400, cost=400),
        Supply(name="Fried Oyster Skins", quantity=300, cost=350),
        Supply(name="Painted Meat (Pretty Patties)", quantity=300, cost=800),
        Supply(name="Chum (Plankton’s Revenge Patty)", quantity=100, cost=300),
        Supply(name="Slider Patties (for Patty Palooza)", quantity=400, cost=600),
        Supply(name="Patty Cake Batter (Krabby Patty Cake)", quantity=200, cost=200),
        Supply(name="Monster Patty Kit (all ingredients x10)", quantity=100, cost=2000),
        Supply(name="Invisible Meat (Imaginary Inventory)", quantity=1, cost=999),
        Supply(name="Emergency Patty Supply (Anchovy Combo)", quantity=1000, cost=5000),
        Supply(name="Seanut Butter", quantity=300, cost=300),
        Supply(name="Sea Oats (for oatmeal)", quantity=250, cost=250),
        Supply(name="Eggs (ocean-sourced)", quantity=500, cost=400),
        Supply(name="Kelp Flakes (salad topping)", quantity=350, cost=150),
        Supply(name="Barnacle Bacon (vegan-friendly?)", quantity=200, cost=350),
        Supply(name="Pastry Dough (Pearl’s Puff Pastry)", quantity=150, cost=200),
        Supply(name="Chili Base (Mermaid Man Chili)", quantity=300, cost=300),
        Supply(name="Soft Drinks Syrup (cola, orange, grape)", quantity=800, cost=1800),
        Supply(name="CO₂ (carbonation)", quantity=500, cost=300),
        Supply(name="Seafoam Syrup (for Seafoam Soda)", quantity=300, cost=150),
        Supply(name="Kelp Shake Mix", quantity=400, cost=500),
        Supply(name="Atlantis Ale (non-alcoholic)", quantity=250, cost=700),
        Supply(name="Goofy Goober Ice Cream (tubs)", quantity=200, cost=600),
        Supply(name="Chocolate Sauce (Chum Sundae)", quantity=300, cost=200),
        Supply(name="Banana Split Supplies", quantity=200, cost=250),
        Supply(name="Barnacle Brownie Batter", quantity=150, cost=180),
        Supply(name="Sponge Cake Mix (Squarepants mold)", quantity=150, cost=220),
        Supply(name="Squidward’s Cheesecake (nobody eats this)", quantity=20, cost=100),
        Supply(name="Bubble Buddy Parfait Cups", quantity=100, cost=150),
        Supply(name="Kelp Cookies", quantity=200, cost=180),
        Supply(name="Cooking Utensils (spatulas, grills, fryers)", quantity=50, cost=500),
        Supply(name="Cleaning Supplies", quantity=150, cost=600),
        Supply(name="Napkins", quantity=2000, cost=400),
        Supply(name="Straws", quantity=2000, cost=300),
        Supply(name="Food Trays", quantity=800, cost=700),
        Supply(name="Pizza Boxes (for Krusty Krab Pizza)", quantity=500, cost=250),
        Supply(name="Kids Meal Toys (Krabby Land Special)", quantity=300, cost=350),
        Supply(name="Bubble Bottles (for nuggets, burgers, and parfaits)", quantity=50, cost=100),
        Supply(name="Imagination Dust (for Invisible Patty)", quantity=1, cost=123),
        Supply(name="Emergency Bubble Buddy Reserve", quantity=5, cost=89),
        Supply(name="Anchovy Buffet Stockpile", quantity=10000, cost=4000),
        Supply(name="Nasty Patty Preservative (DO NOT USE)", quantity=1, cost=1),
        Supply(name="Golden Loaf Mystery Mix", quantity=300, cost=400),
    ]

    db.session.add_all(supplies)
    db.session.commit()

def undo_supplies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.supplies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM supplies"))
    db.session.commit()