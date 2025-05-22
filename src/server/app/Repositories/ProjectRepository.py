from app.Models.project import Project
from app import db

class ProjectRepository:
    @staticmethod
    def update_project_name(project_id, new_name):
        try:
            # Find the project
            project = Project.query.get(project_id)
            if not project:
                return None  # Return None if project not found
            
            # Update the project name
            project.name = new_name
            db.session.commit()
            
            return project  # Return the updated project
        except Exception as e:
            db.session.rollback()
            raise e
            
    @staticmethod
    def get_project_by_id(project_id):
        try:
            return Project.query.get(project_id)
        except Exception as e:
            raise e

    @staticmethod
    def create_project(nome, contratante, date):
        try:
            new = Project(name=nome, contractor=contratante, date=date)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ProjectController] Erro ao criar novo registro na tabela project... 500")
            return f"{e}", 500
        
    @staticmethod
    def read_projects():
        try:
            projetos = Project.query.all()
            return {
                projeto.id: f"{projeto.name, projeto.contractor}"
                for projeto in projetos
            }, 200
        
        except Exception as e:
            print("[ProjectController] Nenhum projeto encontrado... 404")
            return f"{e}", 404            
