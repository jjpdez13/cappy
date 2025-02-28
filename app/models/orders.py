from .db import db, environment, SCHEMA


class Order(db.Model):
    __tablename__ = 'orders'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    krustomer_name = db.Column(db.String, nullable=False, default="Krustomer")
    status = db.Column(db.String, nullable=False, default="pending")
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    
    item = db.relationship('Item', back_populates='orders')
