from .db import db, environment, SCHEMA

class SupplyItem(db.Model):
    __tablename__ = 'supply_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(
        db.Integer,
        db.ForeignKey(f"{SCHEMA}.items.id") if environment == "production" else db.ForeignKey("items.id"),
        nullable=False
    )

    supply_id = db.Column(
        db.Integer,
        db.ForeignKey(f"{SCHEMA}.supplies.id") if environment == "production" else db.ForeignKey("supplies.id"),
        nullable=False
    )

    amount_used = db.Column(db.Float, nullable=False)

    # Optional relationships
    item = db.relationship("Item", backref="supply_links")
    supply = db.relationship("Supply", backref="used_in_items")

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "supply_id": self.supply_id,
            "amount_used": self.amount_used
        }