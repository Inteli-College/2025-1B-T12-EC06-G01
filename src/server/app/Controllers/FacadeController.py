from app.Repositories.FacadeRepository import FacadeRepository

class FacadeController:
    def __init__(self):
        self.facade_repository = FacadeRepository()
        pass

    def get_facades(self, data):
        try:
            id_predio = data['building_id']

        except Exception as e:
            print("[FacadeController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400
        
        result, code = self.facade_repository.read_facades(id_predio=id_predio)
        return result, code
    
    def post_facade(self, data):
        try:
            id_predio = data['building_id']
            nome = data['name']
        
        except Exception as e:
            print("[FacadeController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400
        
        result, code = self.facade_repository.create_facade(nome=nome, id_predio=id_predio)
        return result, code

    def put_new_facade_name(self, data):
        try:
            id_fachada = data["facade_id"]
            nome_fachada = data["facade_name"]
        
        except Exception as e:
            print("[FacadeController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"Os conteúdos json não são suficentes: {e}"}, 400
        
        new_facade, code = self.facade_repository.update_facade_name(facade_id=id_fachada, facade_name=nome_fachada)

        if code == 200:
            return {
                "name": new_facade.name,
                "id": new_facade.id                
            }, 200
        
        else:
            return {"code": code, "message": new_facade}, code