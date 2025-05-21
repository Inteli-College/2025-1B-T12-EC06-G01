from app.Models.image import Image
from app.Models.building import Building
from app.Models.project import Project
from app import db

class ImageProjectRepository:
    @staticmethod   
    def find_by_project_id(project_id):  
        buildings = Building.query.filter_by(project_id=project_id).all()
        building_ids = [b.id for b in buildings]
        images = Image.query.filter(Image.building_id.in_(building_ids)).all()
        return images