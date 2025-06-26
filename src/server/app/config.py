import os
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():

    # A senha "senha-impossivel-de-adivinhar" deve ser usadad APENAS para desenvolvimento local
    SECRET_KEY = os.getenv("SECRET_KEY") or "senha-impossivel-de-adivinhar"

    # This will create a file in <app> FOLDERse
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

class Cloudinary:
    def __init__(self):
        pass

    def init_app(self, app):
        cloudinary.config( 
            cloud_name = app.config.get("CLOUDINARY_CLOUD_NAME"), 
            api_key = app.config.get("CLOUDINARY_API_KEY"), 
            api_secret = app.config.get("CLOUDINARY_API_SECRET"),
            secure = True
        )

        app.cloudinary = cloudinary
