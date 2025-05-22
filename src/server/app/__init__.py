from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Cloudinary

db = SQLAlchemy()
migrate = Migrate()
cloud = Cloudinary()

def create_app():
    # Configuração do app
    app = Flask(__name__)
    
    
    # Configuração com o banco
    app.config.from_object('app.config.Config')

    CORS(app, supports_credentials=True)

    # Initialize db with app
    db.init_app(app)
    
    migrate.init_app(app, db)
    cloud.init_app(app)
    
    # Import blueprints here to avoid circular imports
    from app.Routes.ClassifyRoute import classify_bp
    from app.Routes.ImageRoute import image_bp
    from app.Routes.ProjectRoutes import project_blueprint
    from app.Routes.BuildingRoute import building_bp
    from app.Routes.ImageBuildingRoute import image_building_bp
    from app.Routes.ImageProjectRoute import image_project_bp

    # Carregando os Models
    from app.Models.project import Project
    from app.Models.building import Building
    from app.Models.image import Image
    from app.Models.log import Log
    from app.Models.user import User

    # registra rotas só depois do init
    app.register_blueprint(classify_bp)
    
    from app.Routes.FilterRoute import filter_bp
    app.register_blueprint(filter_bp)

    app.register_blueprint(image_bp)
    app.register_blueprint(project_blueprint)
    app.register_blueprint(image_building_bp)
    app.register_blueprint(image_project_bp)

    
    from app.Routes.ImageCleanRoutes import image_clean_blueprint
    app.register_blueprint(image_clean_blueprint)

    from app.Routes.BuildingRoute import building_bp
    app.register_blueprint(building_bp)
    


    return app
