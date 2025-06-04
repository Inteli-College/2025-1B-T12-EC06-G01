from app import db
from datetime import datetime

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=True)
    raw_image = db.Column(db.String, nullable=True)  # agora URL em vez de inteiro
    fresh_img = db.Column(db.String)
    datetime = db.Column(db.String, nullable=False, default=lambda : datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    fissure_type = db.Column(db.String)
    veredict = db.Column(db.String, nullable=True)

    facade_id = db.Column(db.Integer, db.ForeignKey('facade.id'), nullable=False)

    facade = db.relationship('Facade', back_populates='images')
    logs = db.relationship('Log', secondary='log_image', back_populates='images')
    def __repr__(self):
        return f'<Image {self.id}>'