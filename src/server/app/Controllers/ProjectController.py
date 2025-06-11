from app.Repositories.ProjectRepository import ProjectRepository
from datetime import datetime
from app import db
from app.Models.project import Project
from app.Models.log import Log
from flask import jsonify
from flask import request

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
        

    def get_all_contractors(self):
        contractors, code = self.project_repository.get_unique_contractors()
        
        if code == 200:
            return contractors, 200 # Retorna a lista diretamente
        
        return {"error": contractors}, code 
    
        
    def get_projects(self):
        # Lê os parâmetros da URL (ex: /projects?order=desc&contractor=IPT)
        contractor = request.args.get('contractor')
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        order = request.args.get('order', 'asc') # 'asc' é o padrão

        start_date, end_date = None, None
        try:
            if start_date_str:
                start_date = datetime.fromisoformat(start_date_str).date()
            if end_date_str:
                end_date = datetime.fromisoformat(end_date_str).date()
        except ValueError:
            return {"error": "Formato de data inválido. Use YYYY-MM-DD."}, 400

        # Chama o novo método do repositório
        projects_list, code = self.project_repository.get_filtered_projects(
            contractor=contractor,
            start_date=start_date,
            end_date=end_date,
            order=order
        )
        
        if code == 200:
            # Formata a resposta para um JSON limpo e padronizado
            result = [
                {
                    "id": p.id,
                    "name": p.name,
                    "contractor": p.contractor,
                    "date": p.date.isoformat() if p.date else None
                }
                for p in projects_list
            ]
            return result, 200
        
        return {"error": projects_list}, code
        
            

