import os

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():

    # This will create a file in <app> FOLDERse
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRE_URL")
    print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_TRACK_MODIFICATIONS = False