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

    @staticmethod
    def get_all_buildings():
        """
        Retorna todos os registros da tabela Building.
        """
        try:
            buildings = Building.query.all()
            return buildings, 200
        except Exception as e:
            print(f"[BuildingRepository] Erro ao buscar todos os prédios: {e}")
            return [], 500

    @staticmethod
    def get_buildings_by_project(project_id: int):
        """
        Retorna todos os prédios de um projeto específico.
        """
        try:
            buildings = Building.query.filter_by(project_id=project_id).all()
            return buildings, 200
        except Exception as e:
            print(f"[BuildingRepository] Erro ao buscar prédios do projeto {project_id}: {e}")
            return [], 500
