from datetime import datetime
from decimal import Decimal
from app import db

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    raw_image = db.Column(db.String, nullable=True)  # agora URL em vez de inteiro
    fresh_img = db.Column(db.Integer)
    datetime = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    latitude = db.Column(db.Numeric(9,6))
    longitude = db.Column(db.Numeric(9,6))
    fissure_type = db.Column(db.Integer)
    veredict = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    project = db.relationship('Project', back_populates='images')
    logs = db.relationship('Log', back_populates='image', cascade='all, delete-orphan')