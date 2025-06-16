from app import db
from app.Models.project import Project
from app.Models.building import Building
from app.Models.facade import Facade
from app.Models.image import Image

class ReportRepository:
    def get_report_data_for_project(self, project_id: int):
        """
        Busca todos os dados necessários para o relatório de um projeto.

        Esta função executa uma única consulta ao banco de dados, juntando
        as tabelas Project, Building, Facade e Image para obter todos os
        dados de forma eficiente.

        Retorna uma tupla contendo o objeto do projeto e uma lista de
        resultados da consulta.
        """
        # Primeiro, busca o projeto para garantir que ele existe e para obter seus dados.
        project = Project.query.get(project_id)
        if not project:
            return None, []

        # Consulta principal que junta todas as tabelas necessárias
        query_results = db.session.query(
            Image,
            Facade,
            Building
        ).join(
            Facade, Image.facade_id == Facade.id
        ).join(
            Building, Facade.building_id == Building.id
        ).filter(
            Building.project_id == project_id
        ).all()

        return project, query_results