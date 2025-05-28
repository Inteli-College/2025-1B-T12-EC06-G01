from app.Models.facade import Facade
from app import db


class FacadeRepository:
    def __init__(self):
        pass

    @staticmethod
    def read_facades(id_predio: int):
        try:
            fachadas_nomes = (
                db.session.query(Facade.name)
                .filter(Facade.building_id == id_predio)
                .distinct()
                .all()
            )
            fachadas_unicas = [nome[0] for nome in fachadas_nomes]

            return {
                "building_id": id_predio,
                "fachadas": fachadas_unicas
            }, 200
        
        except Exception as e:
            print(f"[FacadeRepository] Nenhuma fachada encontrada... {e}")
            return {"code": 404, "message": "Nenhuma fachada encontrada..."}, 404   

    @staticmethod
    def create_facade(nome: str, id_predio: int):
        try:
            new = Facade(name=nome, building_id=id_predio)
            db.session.add(new) 
            db.session.commit()
            return new, 201
        
        except Exception as e:
            print("[FacadeRepository] Erro ao criar novo registro 500")
            return {"code": 500, "message": "Erro ao criar um novo registro no banco de dados..."}, 500