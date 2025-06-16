from datetime import datetime
from app import db

class Log(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    action = db.Column(db.String, nullable=True)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    building_id = db.Column(db.Integer, db.ForeignKey('building.id'), nullable=True)
    facade_id = db.Column(db.Integer, db.ForeignKey('facade.id'), nullable=True)

    facade = db.relationship('Facade', back_populates='logs')
    user = db.relationship('User', back_populates='logs')
    project = db.relationship('Project', back_populates='logs')
    building = db.relationship('Building', back_populates='logs')
    
    images = db.relationship('Image', secondary='log_image', back_populates='logs')




