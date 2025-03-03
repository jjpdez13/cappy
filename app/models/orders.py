from .db import db, environment, SCHEMA
from .items import order_items

class Order(db.Model):
    __tablename__ = 'orders'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    krustomer_name = db.Column(db.String, nullable=False, default="Krustomer")
    status = db.Column(db.String, nullable=False, default="pending")
    
    items = db.relationship('Item', secondary=order_items, back_populates="orders")
    
    def to_dict(self):
        return {
            "id": self.id,
            "krustomer_name": self.krustomer_name,
            "status": self.status,
            "items": [item.to_dict() for item in self.items],
            "total_price": sum(item.price for item in self.items)
        }
        