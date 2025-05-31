from app import db

class Building(db.Model):
    __tablename__ = 'building'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    predio = db.Column(db.String, nullable=False)
    latitude = db.Column(db.Numeric(9,6), nullable=True)
    longitude = db.Column(db.Numeric(9,6), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    project = db.relationship('Project', back_populates='building')
    facade = db.relationship('Facade', back_populates='building', cascade='all, delete-orphan')
    logs = db.relationship('Log', back_populates='building')