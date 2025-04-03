from flask.cli import AppGroup
from .users import seed_users, undo_users
from .menus import seed_menus, undo_menus
from .items import seed_items, undo_items
from .orders import seed_orders, undo_orders
from .order_items import undo_order_items
from .supplies import seed_supplies, undo_supplies
from .supply_items import seed_supply_items, undo_supply_items
from .expenses import seed_expenses, undo_expenses


from app.models.db import db, environment, SCHEMA


seed_commands = AppGroup('seed')

# Create the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, undo all data first
        undo_order_items()
        undo_users()
        undo_menus()
        undo_items()
        undo_orders()
        undo_supplies()
        undo_supply_items()
        undo_expenses()

    # Now, seed all tables
    seed_users()
    seed_menus()
    seed_items()
    seed_orders()
    seed_supplies()
    seed_supply_items()
    seed_expenses()

# Create the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_order_items()
    undo_users()
    undo_menus()
    undo_items()
    undo_orders()
    undo_supplies()
    undo_supply_items()
    undo_expenses()