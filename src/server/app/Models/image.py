from app import db
from datetime import datetime

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    raw_image = db.Column(db.String, nullable=True)  # agora URL em vez de inteiro
    fresh_img = db.Column(db.String, nullable=False)
    datetime = db.Column(db.String, nullable=False, default=lambda : datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    fissure_type = db.Column(db.String)
    veredict = db.Column(db.String, nullable=True)
    fachada = db.Column(db.String, nullable=False)
    building_id = db.Column(db.Integer, db.ForeignKey('building.id'), nullable=False)

    building = db.relationship('Building', back_populates='images')


    logs = db.relationship('Log', back_populates='image', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Image {self.id}>'