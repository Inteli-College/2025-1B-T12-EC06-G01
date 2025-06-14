from app.Models.project import Project
from app import db
from sqlalchemy import asc, desc

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
    def get_unique_contractors():
        try:
            # Consulta que seleciona a coluna 'contractor', pega apenas os valores distintos (únicos) e ordena.
            query = db.session.query(Project.contractor).distinct().order_by(Project.contractor)
            # O resultado é uma lista de tuplas, ex: [('Inteli',), ('IPT',)], então extraímos o primeiro item de cada.
            contractors = [row[0] for row in query.all()]
            return contractors, 200
        except Exception as e:
            print(f"[ProjectRepository] Erro ao buscar contratantes únicos: {e}")
            return str(e), 500

    @staticmethod
    def get_filtered_projects(contractor=None, start_date=None, end_date=None, order='asc'):
        try:
            query = Project.query

            if contractor:
                query = query.filter(Project.contractor == contractor)

            if start_date:
                query = query.filter(Project.date >= start_date)
            if end_date:
                query = query.filter(Project.date <= end_date)

            if order.lower() == 'desc':
                query = query.order_by(desc(Project.name))
            else:
                query = query.order_by(asc(Project.name))

            return query.all(), 200
        except Exception as e:
            print(f"[ProjectRepository] Erro ao buscar projetos filtrados: {e}")
            return str(e), 500

    @staticmethod
    def create_project(nome, contratante, date):
        try:
            new = Project(name=nome, contractor=contratante, date=date)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ProjectRepository] Erro ao criar novo registro na tabela project... 500")
            db.session.rollback() # Adicionado rollback em caso de erro
            return f"{e}", 500
        
