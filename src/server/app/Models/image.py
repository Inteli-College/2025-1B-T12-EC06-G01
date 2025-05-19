from flask import current_app
from app import db
from datetime import datetime

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    raw_image = db.Column(db.String, nullable=True)  # agora URL em vez de inteiro
    fresh_img = db.Column(db.String, nullable=False)
    datetime = db.Column(db.String, nullable=False, default=lambda : datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    latitude = db.Column(db.Numeric(9,6))
    longitude = db.Column(db.Numeric(9,6))
    fissure_type = db.Column(db.String)
    veredict = db.Column(db.String, nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    project = db.relationship('Project', back_populates='images')
    logs = db.relationship('Log', back_populates='image', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Image {self.id}>'