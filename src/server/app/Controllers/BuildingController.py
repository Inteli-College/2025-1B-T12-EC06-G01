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
            return {"code": 400, "message": e}, 400
        
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
        
