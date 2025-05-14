from flask import Flask
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    # Configuração do app
    app = Flask(__name__)
    load_dotenv()
    
    # Configuração com o banco
    app.config.from_object('app.config.Config')
    
    # Initialize db with app
    db.init_app(app)
    
    # Import blueprints here to avoid circular imports
    from app.Routes.ClassifyRoute import classify_bp
    from app.Routes.ImageRoute import image_bp
    
    app.register_blueprint(classify_bp)
    app.register_blueprint(image_bp)
    
    return app
