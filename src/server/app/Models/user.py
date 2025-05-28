from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    logs = db.relationship('Log', back_populates='user')

    def __repr__(self):
        return f'<User {self.id} - {self.name}>'
