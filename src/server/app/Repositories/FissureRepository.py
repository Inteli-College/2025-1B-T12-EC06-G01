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
            print(f"[FissureRepository] Algo deu errado ao buscar as fissuras no banco de dados: {e}")
            return f"Algo deu errado ao buscar as fissuras no banco de dados: {e}", 404
    

    @staticmethod
    def read_fissures():
        """
        Acessa todos os tipos de fissuras disponíveis no banco de dados.
        """
        try: 
            fissure_types = {}
            fissuras = Fissure.query.all()
            for fissura in fissuras:
                nome_fissura = fissura.fissure_name
                fissure_types[f"{nome_fissura}"] = []
                

            return fissure_types, fissuras
        except Exception as e:
            print(f"[FissureRepository] Algo deu errado ao buscar os objetos de fissuras no banco de dados: {e}")
            return f"Algo deu errado ao buscar os objetos de fissuras no banco de dados: {e}", 404