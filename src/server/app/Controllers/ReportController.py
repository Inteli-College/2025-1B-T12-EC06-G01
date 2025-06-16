from flask import jsonify
from app.Services.ReportService import ReportService

class ReportController:
    def __init__(self):
        self.service = ReportService()

    def get_project_report(self, project_id: int):
        """
        Lida com a requisição da rota para gerar o relatório do projeto.
        """
        report_data = self.service.generate_project_report(project_id)

        if report_data is None:
            return jsonify({"error": "Projeto não encontrado"}), 404

        return jsonify(report_data), 200
    
    