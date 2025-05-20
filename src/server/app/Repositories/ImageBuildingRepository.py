from app.Models.image import Image
from app import db

class ImageBuildingRepository:
    @staticmethod
    def find_by_building_id(self, building_id):
        return Image.query.filter_by(building_id=building_id).all()