# conditional_seed.py
from app.models import db, Menu, Item

def seed_menu_items(menu_name):
    menu = Menu.query.filter_by(name=menu_name).first()
    if not menu:
        return

    menu_items = {
        "Desserts": [
            {"name": "Chocolate Chum Sundae", "price": 3.99},
            {"name": "Goofy Goober Ice Cream", "price": 4.49},
            {"name": "Barnacle Brownie", "price": 3.49},
            {"name": "Pearl's Puff Pastry", "price": 4.99},
            {"name": "Bubble Buddies Parfait", "price": 4.49},
            {"name": "Squidward’s Cheesecake", "price": 4.99},
            {"name": "Krabby Patty Cake", "price": 5.49},
            {"name": "Kelp Cookie", "price": 1.99},
            {"name": "Bikini Bottom Banana Split", "price": 5.99},
            {"name": "Sponge Cake Squarepants", "price": 4.99},
        ],
        "Specials": [
            {"name": "Krusty Krab Pizza", "price": 9.99},
            {"name": "Nasty Patty (At Your Own Risk!)", "price": 6.99},
            {"name": "Pretty Patties", "price": 5.99},
            {"name": "Patty Palooza Platter", "price": 11.99},
            {"name": "The Monster Krabby Patty", "price": 10.99},
            {"name": "Krabby Land Special", "price": 8.99},
            {"name": "Plankton’s Revenge Patty (Chum Patty)", "price": 7.99},
            {"name": "Bubble Buddy’s Best Burger", "price": 6.99},
            {"name": "Invisible Patty (Imaginary!)", "price": 4.99},
            {"name": "Anchovy Special Combo", "price": 9.49},
        ]
    }

    items_data = menu_items.get(menu_name, [])

    existing_items = {
        item.name for item in Item.query.filter(Item.menu_id == menu.id).all()
    }

    new_items = [
        Item(
            name=data["name"],
            price=data["price"],
            menu_id=menu.id,
            category=menu_name
        )
        for data in items_data
        if data["name"] not in existing_items
    ]

    if new_items:
        db.session.add_all(new_items)
        db.session.commit()