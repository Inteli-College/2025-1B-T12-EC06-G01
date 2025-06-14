from app.Repositories.ProjectRepository import ProjectRepository
from datetime import datetime
from app import db
from app.Models.project import Project
from app.Models.log import Log
from flask import jsonify

class ProjectController:
    def __init__(self):
        self.project_repository = ProjectRepository()

    def update_project_name(self, project_id, data):
        try:
            if not project_id:
                print("[ProjectController] Erro ao receber requisição! 400 - Project ID is required")
                return {"code": 400, "message": "Project ID is required"}, 400
                
            if not data or 'name' not in data:
                print("[ProjectController] Erro ao receber requisição! 400 - New project name is required")
                return {"code": 400, "message": "New project name is required"}, 400
            
            new_name = data['name'].strip()
            if not new_name:
                print("[ProjectController] Erro ao receber requisição! 400 - New project name cannot be empty")
                return {"code": 400, "message": "New project name cannot be empty"}, 400
            
            # Update the project name
            updated_project = self.project_repository.update_project_name(project_id, new_name)
            
            if not updated_project:
                print(f"[ProjectController] Erro ao receber requisição! 404 - Project with ID {project_id} not found")
                return {"code": 404, "message": f"Project with ID {project_id} not found"}, 404
            
            return {
                "code": 200,
                "message": "Project name updated successfully",
                "project": {
                    "id": updated_project.id,
                    "name": updated_project.name,
                }
            }, 200
        except Exception as e:
            print(f"[ProjectController] Erro ao receber requisição! 500 - {str(e)}")
            return {"code": 500, "message": str(e)}, 500

    def post_project(self, data):

        try:
            nome = data['name']
            contratante = data['contractor']
            date = data['date'] if data['date'] else str(datetime.now())           

        except Exception as e:
            print("[ProjectController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400

        new, code = self.project_repository.create_project(nome=nome, contratante=contratante, date=date)

        if code != 500:
            return {
                "id": new.id,
                "nome": new.name,
                "contractor": new.contractor,
                "date": new.date
            }, code
        
        else:
            return {"code": code, "message": new}, code
        
    def get_project(self):
        result, code = self.project_repository.read_projects()
        return result, code

        
            

