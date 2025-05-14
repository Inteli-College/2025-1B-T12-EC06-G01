from datetime import datetime
from app import db

class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    contractor = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    images = db.relationship('Image', back_populates='project', cascade='all, delete-orphan')