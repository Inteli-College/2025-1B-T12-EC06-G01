from app import db
from app.Models.project import Project

class ProjectRepository:
    def __init__(self):
        pass
    
    @staticmethod
    def create_project(nome, contratante, date):
        try:
            new = Project(name=nome, contractor=contratante, date=date)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ProjectController] Erro ao criar novo registro! 500")
            return e, 500