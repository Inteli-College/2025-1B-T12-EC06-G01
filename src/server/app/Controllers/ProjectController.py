from app.Repositories.ProjectRepository import ProjectRepository

class ProjectController:
    def __init__(self):
        self.project_repository = ProjectRepository()

    def update_project_name(self, project_id, new_name):
        try:
            if not project_id:
                return {"error": "Project ID is required"}, 400
                
            if not new_name or not new_name.strip():
                return {"error": "New project name is required"}, 400
            
            # Trim any leading/trailing whitespace
            new_name = new_name.strip()
            
            # Update the project name
            updated_project = self.project_repository.update_project_name(project_id, new_name)
            
            if not updated_project:
                return {"error": f"Project with ID {project_id} not found"}, 404
            
            return {
                "message": "Project name updated successfully",
                "project": {
                    "id": updated_project.id,
                    "name": updated_project.name,
                }
            }, 200
        except Exception as e:
            return {"error": str(e)}, 500