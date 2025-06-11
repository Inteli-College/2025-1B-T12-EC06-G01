from app import db

class Fissure(db.Model):
    __tablename__ = "fissure"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fissure_name = db.Column(db.String, nullable=True)

    images = db.relationship('Image', back_populates='fissure', cascade='all, delete-orphan')
