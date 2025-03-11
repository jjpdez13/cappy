from .db import db, environment, SCHEMA
from .items import order_items, Item


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    krustomer_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")
    
    # Define the relationship with Order Items
    items = db.relationship("Item", secondary="order_items", back_populates="orders")

    def to_dict(self):
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
                    "quantity": order_item.quantity
                }
                for item in self.items
                for order_item in db.session.query(order_items).filter_by(order_id=self.id, item_id=item.id)
            ]
        }