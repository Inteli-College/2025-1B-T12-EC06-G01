from app.Models import Fissure
from app import db

class FissureRepository:
    def __init__(self):
        pass

    @staticmethod
    def read_fissure_types():
        """
        Acessa todos os tipos de fissuras disponíveis no banco de dados.
        """
        try: 
            fissure_types = (
                db.session.query(Fissure.fissure_name)
                .distinct()
                .all()
            )
            return fissure_types, 200
        except Exception as e:
            print(f"[ImageRepository] Algo deu errado ao buscar as fissuras no banco de dados: {e}")
            return f"Algo deu errado ao buscar as fissuras no banco de dados: {e}", 404