from app.Repositories.BuildingRepository import BuildingRepository

class BuildingController:
    def __init__(self):
        self.building_repo = BuildingRepository()
        pass

    def post_building(self, data):
        try:
            projeto_id = data['project_id']
            predio = data['predio']
            latitude = data['latitude'] if data['latitude'] else None
            longitude = data['longitude'] if data['longitude'] else None

        except Exception as e:
            print("[BuildingController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": str(e)}, 400 
        
        new, code = self.building_repo.create_building(project_id=projeto_id, predio=predio, latitude=latitude, longitude=longitude)

        if code != 500:
            return {
                "id": new.id,
                "projeto_id": new.project_id,
                "predio": new.predio,
                "latitude": new.latitude,
                "longitude": new.longitude
            }, code
        
        else:
            return {"code": code, "message": new}, code

    def get_buildings(self, data):
        """
        Busca todos os prédios e formata para resposta JSON.
        """

        buildings_data, code = self.building_repo.get_all_buildings()

        if code == 200:
            # Transforma a lista de objetos Building em uma lista de dicionários
            # É importante que seu modelo Building tenha os atributos referenciados (id, project_id, predio, etc.)
            # Se o seu modelo Building tiver um método to_dict(), seria ainda melhor.
            # Exemplo: return [building.to_dict() for building in buildings_data], code
            result = []
            for building in buildings_data:
                result.append({
                    "id": building.id, # Supondo que o modelo Building tenha esses atributos
                    "project_id": building.project_id,
                    "predio": building.predio,
                    "latitude": building.latitude,
                    "longitude": building.longitude,
                    # Adicione outros campos que você queira retornar do seu modelo Building
                })
            return result, code
        else:
            return {"code": code, "message": "Erro ao buscar prédios"}, code
