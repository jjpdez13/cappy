from .db import db, environment, SCHEMA
from .items import order_items, Item


class Order(db.Model):
    __tablename__ = "orders"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    krustomer_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")
    
    # Define the relationship with Order Items
    items = db.relationship("Item", secondary=order_items, back_populates="orders")

    def to_dict(self):
        order_item_quantities = { 
            (row.order_id, row.item_id): row.quantity 
            for row in db.session.query(order_items).filter(order_items.c.order_id == self.id).all()
        }
        
        return {
            "id": self.id,
            "krustomer_name": self.krustomer_name,
            "status": self.status,
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "price": item.price,
                    "category": item.category,
                    "is_active": item.is_active,
                    "quantity": db.session.query(order_items.c.quantity)
                                         .filter(order_items.c.order_id == self.id, order_items.c.item_id == item.id)
                                         .scalar()
                }
                for item in self.items
            ]
        }