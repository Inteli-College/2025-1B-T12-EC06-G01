from app.Models.image import Image
from app import db

class ImageBuildingRepository:
    @staticmethod
    def find_by_building_id(building_id):  # Removido o parâmetro 'self'
        return Image.query.filter_by(building_id=building_id).all()