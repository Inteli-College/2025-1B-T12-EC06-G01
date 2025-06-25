from datetime import datetime
from app import db

class ModelVersion(db.Model):
    __tablename__ = 'model_version'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    train_directory = db.Column(db.String, nullable=True)
    version = db.Column(db.String, nullable=False)
    real_model = db.Column(db.Boolean, nullable=False) 
    accuracy = db.Column(db.Float, nullable=False)
