# log_image.py ou onde preferir declarar
from app import db

log_image = db.Table(
    'log_image',
    db.Column('log_id', db.Integer, db.ForeignKey('logs.id'), primary_key=True),
    db.Column('image_id', db.Integer, db.ForeignKey('images.id'), primary_key=True)
)
