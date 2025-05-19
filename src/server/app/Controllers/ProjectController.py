from app.Repositories.ProjectRepository import ProjectRepository
from datetime import datetime
from app.Services.LogService import log_service


class ProjectController:
    def __init__(self):
        self.project_repo = ProjectRepository()
        pass

    def post_project(self, data):

        try:
            nome = data['name']
            contratante = data['contractor']
            date = data['date'] if data['date'] else str(datetime.now())           

        except Exception as e:
            print("[ProjectController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400

        new, code = self.project_repo.create_project(nome=nome, contratante=contratante, date=date)

        if code != 500:
            return {
                "id": new.id,
                "nome": new.name,
                "contractor": new.contractor,
                "date": new.date
            }, code
        
        else:
            return {"code": code, "message": new}, code
            


