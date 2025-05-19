from datetime import datetime
from app import db

class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    contractor = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False, default=lambda : datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    building = db.relationship('Building', back_populates='project', cascade='all, delete-orphan')