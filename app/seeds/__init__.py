from flask.cli import AppGroup
from .users import seed_users, undo_users
from .menus import seed_menus, undo_menus
from .items import seed_items, undo_items
from .orders import seed_orders, undo_orders
from .order_items import undo_order_items

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, undo all data first
        undo_order_items()  # 🔹 Add this to clear the order_items table
        undo_users()
        undo_menus()
        undo_items()
        undo_orders()

    # Now, seed all tables
    seed_users()
    seed_menus()
    seed_items()
    seed_orders()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_order_items()  # 🔹 Add this here too
    undo_users()
    undo_menus()
    undo_items()
    undo_orders()