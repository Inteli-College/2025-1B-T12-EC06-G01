from app.Models.facade import Facade
from app import db


class FacadeRepository:
    def __init__(self):
        pass

    @staticmethod
    def read_facades(id_predio: int):
        try:
            facades = (
                Facade.query
                .filter_by(building_id=id_predio)
                .with_entities(Facade.id, Facade.name)
                .distinct(Facade.name)
                .all()
            )
            return {
                    "building_id": id_predio,
                    "fachadas":
                    [{"id": f.id, "nome": f.name} for f in facades]
                    }, 200
        
        except Exception as e:
            print(f"[FacadeRepository] Erro ao buscar fachadas: {e}")
            return {"code": 500, "message": "Erro interno no servidor"}, 500

    @staticmethod
    def create_facade(nome: str, id_predio: int):
        try:
            new = Facade(name=nome, building_id=id_predio)
            db.session.add(new) 
            db.session.commit()

            result = {
                "id": new.id,
                "name": new.name,
                "building_id": new.building_id
            }

            return result, 201
        
        except Exception as e:
            print("[FacadeRepository] Erro ao criar novo registro 500")
            return {"code": 500, "message": "Erro ao criar um novo registro no banco de dados..."}, 500
