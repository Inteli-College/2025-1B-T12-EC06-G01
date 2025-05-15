from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os

# Cria o db global, que será importado pelos models
db = SQLAlchemy()

def create_app():
    load_dotenv()
    app = Flask(__name__)

    # carrega Config (inclui DATABASE_URL)
    app.config.from_object('app.config.Config')

    # associa o db ao app
    db.init_app(app)

    # registra rotas só depois do init
    from app.Routes.ClassifyRoute import classify_bp
    from app.Routes.FilterRoute import filter_images_route
    app.register_blueprint(classify_bp)
    app.register_blueprint(filter_images_route)

    return app
