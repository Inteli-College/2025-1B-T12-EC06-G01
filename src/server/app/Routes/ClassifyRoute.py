from flask import Blueprint, request, jsonify
from app.Controllers.ClassifyController import ClassifyController

controller = ClassifyController()
classify_bp   = Blueprint("classify", __name__, url_prefix="/facades/<int:facade_id>/classify")

@classify_bp.route("/", methods=["POST"])
def classify_route(facade_id):
    """
    Fluxo de dados:
      ClassifyRoute -> ClassifyController: recebe facade_id da URL e JSON com start_date?, end_date?; retorna JSON de resultados
      ClassifyController -> ImageClassificationService: recebe facade_id, start_date, end_date; retorna dict URL->classificação
      ImageClassificationService -> ClassificationRepository: recebe lista de URLs; retorna resultados de inferência
      ImageClassificationService -> grava resultado no banco e cria um log
    """
    payload = request.get_json(force=True) if request.is_json else {}
    return controller.postClassify(facade_id, payload)

@classify_bp.route("/retrain", methods=["POST"])
def retrain_route():
    data = request.json
    result, code = controller.retrain(data)
    return jsonify(result), code