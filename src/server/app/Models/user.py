from app import db
from flask_bcrypt import Bcrypt

# Crie uma instância do Bcrypt
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False) # Adicionado um tamanho para o campo
    
    # Adicionado unique=True para garantir que não haja emails duplicados
    email = db.Column(db.String(150), unique=True, nullable=False)

    # O campo 'password' foi renomeado para 'password_hash' por clareza e segurança
    password_hash = db.Column(db.String(128), nullable=False)

    logs = db.relationship('Log', back_populates='user')

    # Método para criar o hash da senha a partir de um texto puro
    def set_password(self, password):
        """Gera o hash da senha e o armazena."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Método para verificar se a senha fornecida corresponde ao hash
    def check_password(self, password):
        """Verifica se a senha fornecida corresponde ao hash armazenado."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.id} - {self.name}>'