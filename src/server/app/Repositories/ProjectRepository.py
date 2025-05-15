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