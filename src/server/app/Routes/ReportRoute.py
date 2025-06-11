from flask import Blueprint
from app.Controllers.ReportController import ReportController

# Cria um Blueprint para as rotas de relatório
report_bp = Blueprint('report', __name__, url_prefix='/projects/<int:project_id>/report')
controller = ReportController()

@report_bp.route('/', methods=['GET'])
def get_report(project_id):
    """
    Endpoint para gerar e retornar o relatório consolidado de um projeto.
    GET /projects/1/report
    """
    return controller.get_project_report(project_id)