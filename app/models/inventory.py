from .db import db, SCHEMA, environment, add_prefix_for_prod

class Supply(db.Model):
    __tablename__ = 'supplies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    cost = db.Column(db.Float, nullable=False, default=0.0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "quantity": self.quantity,
            "cost": self.cost
        }
        
