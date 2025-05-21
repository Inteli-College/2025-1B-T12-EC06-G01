from flask import Blueprint, request
from app.Controllers.ClassifyController import ClassifyController

classify_ctrl = ClassifyController()
classify_bp   = Blueprint("classify", __name__, url_prefix="/classify")

@classify_bp.route("/", methods=["POST"])
def classify_route():
    """
    Fluxo de dados:
      ClassifyRoute -> ClassifyController: recebe JSON com project_id, start_date?, end_date?; retorna JSON de resultados
      ClassifyController -> ImageClassificationService: recebe project_id, start_date, end_date; retorna dict URL->classificação
      ImageClassificationService -> ClassificationRepository: recebe lista de URLs; retorna resultados de inferência
      (futuro) ImageClassificationService grava resultado no banco e cria um log
    """
    payload = request.get_json(force=True)
    return classify_ctrl.postClassify(payload)
