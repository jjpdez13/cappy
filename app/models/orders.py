from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    krustomer_name = db.Column(db.String, nullable=False, default="Krustomer")
    status = db.Column(db.String, nullable=False, default="pending")
    
    menu = db.relationship('Menu', back_populates='items')