from .db import db, environment, SCHEMA

order_items = db.Table(
    "order_items",
    db.Model.metadata,
    db.Column(
        "order_id", 
        db.Integer, 
        db.ForeignKey(f"{SCHEMA}.orders.id") if environment == "production" else db.ForeignKey("orders.id"),
        primary_key=True
    ),
    db.Column(
        "item_id", 
        db.Integer, 
        db.ForeignKey(f"{SCHEMA}.items.id") if environment == "production" else db.ForeignKey("items.id"),
        primary_key=True
    )
)

class Item(db.Model):
    __tablename__ = 'items'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.menus.id') if environment == "production" else db.ForeignKey("menus.id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    
    menu = db.relationship('Menu', back_populates='items')
    orders = db.relationship('Order', secondary=order_items, back_populates='items')
    
    def to_dict(self):
        return {
            "id": self.id,
            "menu_id": self.menu_id,
            "name": self.name,
            "price": self.price,
            "category": self.category,
            "is_active": self.is_active
        }