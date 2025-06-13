from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cloudinary
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Carrega as variáveis do .env
load_dotenv()

# Configuração do Cloudinary diretamente com o SDK oficial
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Banco de dados e migrações
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Configuração com o banco
    app.config.from_object('app.config.Config')

    CORS(app, supports_credentials=True)

    # Initialize db with app
    db.init_app(app)
    
    migrate.init_app(app, db)

    # Import blueprints here to avoid circular imports
    from app.Routes.ClassifyRoute import classify_bp
    from app.Routes.ImageRoute import image_bp
    from app.Routes.ProjectRoutes import project_blueprint
    from app.Routes.BuildingRoute import building_bp
    from app.Routes.FacadeRoute import facade_bp
    from app.Routes.FilterRoute import filter_bp
    from app.Routes.ImageCleanRoutes import image_clean_blueprint
    from app.Routes.UserRoute import user_bp
    from app.Routes.ReportRoute import report_bp
    from app.Routes.ContractorRoute import contractor_bp

    # Carregando os Models
    from app.Models.project import Project
    from app.Models.building import Building
    from app.Models.facade import Facade
    from app.Models.image import Image
    from app.Models.log import Log
    from app.Models.log_image import log_image
    from app.Models.user import User
    from app.Models.model_version import ModelVersion
    from app.Models.fissure import Fissure


    app.register_blueprint(classify_bp)  
    app.register_blueprint(filter_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(project_blueprint)
    app.register_blueprint(user_bp)
    app.register_blueprint(image_clean_blueprint)
    app.register_blueprint(facade_bp)    
    app.register_blueprint(building_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(contractor_bp)

    return app
