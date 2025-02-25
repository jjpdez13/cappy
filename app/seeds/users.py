from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    krabs = User(
        employee_id=1, email='money.krabs@kk.io', password='$money$')
    squidward = User(
        employee_id=2, email='mr.tentacles@kk.io', password='clarinet1')
    spongebob = User(
        employee_id=3, email='musclebob.buffpants@kk.io', password='GaryTheSnail<3')

    db.session.add(krabs)
    db.session.add(squidward)
    db.session.add(spongebob)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
