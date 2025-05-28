from app import db

class Facade(db.Model):
    __tablename__ = "facade"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=True)


    building_id = db.Column(db.Integer, db.ForeignKey('building.id'), nullable=False)
    building = db.relationship('Building', back_populates='facade')

    images = db.relationship('Image', back_populates='facade', cascade='all, delete-orphan')
    logs = db.relationship('Log', back_populates='facade')
