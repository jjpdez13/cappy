from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Menu(db.Model):
    __tablename__ = 'menus'
    
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(30), nullable=False)
    
    items = db.relationship('Item', back_populates='menu', cascade='all, delete-orphan')