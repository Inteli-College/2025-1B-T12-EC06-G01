from datetime import datetime
from app import db

class ModelVersion(db.Model):
    __tablename__ = 'model_version'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    train_directory = db.Column(db.String, nullable=False)
    version = db.Column(db.Integer, nullable=False)
    real_model = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.name}>'
