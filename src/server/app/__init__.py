from flask import Flask
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
from app.Routes.ClassifyRoute import classify_bp

def create_app():
    # Configuração do app
    app = Flask(__name__)
    load_dotenv()
    
    # Configuração com o banco
    app.config.from_object('app.config.Config')
    db = SQLAlchemy(app)


    app.register_blueprint(classify_bp)
    return app
