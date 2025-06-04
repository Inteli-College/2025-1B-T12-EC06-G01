from datetime import datetime
from app import db

class ModelVersion(db.Model):
    __tablename__ = 'model_version'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    train_number = db.Column(db.String, nullable=False)
    version = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.name}>'
