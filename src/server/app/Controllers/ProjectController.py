from app.Repositories.ProjectRepository import ProjectRepository
from datetime import datetime
from app import db
from app.Models.project import Project
from app.Models.log import Log


class ProjectController:
    def __init__(self, data, images):
        self.data = data
        self.images = images
        pass

    def post_project(self):

        try:
            nome = self.data['name']
            contratante = self.data['contractor']
            date = self.data['date'] if self.data['date'] else str(datetime.now())

            

        except Exception as e:
            print("[ProjectController] Erro ao receber requisição! 400")
            return {"code": 400, "message": e}, 400
        
        try:
            new = Project(nome=nome, contractor=contratante, date=date)
            db.session.add(new)
            db.session.commit()


            return {
                "id": new.id,
                "nome": new.nome,
                "contractor": new.contractor,
                "date": new.date
            }, 201
        
        except Exception as e:
            print("[ProjectController] Erro ao criar novo registro! 500")
            return {"code": 500, "message": e}, 500


