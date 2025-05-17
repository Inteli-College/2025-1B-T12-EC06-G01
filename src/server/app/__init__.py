from flask import Flask
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
    db.init_app(app)
    migrate.init_app(app, db)
    cloud.init_app(app)

    # Carregando os Models
    from app.Models.project import Project
    from app.Models.building import Building
    from app.Models.image import Image
    from app.Models.log import Log
    from app.Models.user import User
    
    #Registrando Blueprints
    from app.Routes.ProjectRoute import project_bp
    app.register_blueprint(project_bp)

    return app
