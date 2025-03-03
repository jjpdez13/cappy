from .db import db, environment, SCHEMA

        
class Menu(db.Model):
    __tablename__ = 'menus'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
        
    items = db.relationship('Item', back_populates='menu', cascade='all, delete-orphan')