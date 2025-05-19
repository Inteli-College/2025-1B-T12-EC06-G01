from app.Models.building import Building
from app import db

class BuildingRepository:
    def __init__(self):
        pass
    
    @staticmethod
    def create_building(project_id: int, predio: str, latitude, longitude):
        try:
            new = Building(predio=predio, latitude=latitude, longitude=longitude, project_id=project_id)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ProjectController] Erro ao criar novo registro! 500")
            return f"{e}", 500