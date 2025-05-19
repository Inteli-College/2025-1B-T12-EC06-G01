from datetime import datetime
from app import db

class Log(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.Integer, primary_key=True)
    mensage = db.Column(db.String, nullable=False)
    datetime = db.Column(db.String, nullable=False, default=lambda : datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    image = db.relationship('Image', back_populates='logs')
    user = db.relationship('User', back_populates='logs')