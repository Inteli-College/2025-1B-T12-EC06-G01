from flask import Blueprint, request, jsonify
from app.Controllers.ClassifyController import ClassifyController
from app.auth_decorator import token_required

controller = ClassifyController()
classify_bp   = Blueprint("classify", __name__, url_prefix="/classify")

@classify_bp.route("/facades/<int:facade_id>", methods=["POST"])
@token_required
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
@token_required
def retrain_route():
    result, code = controller.retrain()
    return jsonify(result), code

@classify_bp.route("/version", methods=["POST"])
def get_model_versions():
    result, code = controller.get_model_version()
    return jsonify(result), code

@classify_bp.route("/version", methods=["PUT"])
def put_model_version_true():
    try:
        data = request.json

    except Exception as e:
        print("[ClassifyRoute] Erro ao receber requisição POST!")
        return jsonify({"code": 400, "message": f"Erro ao receber requisição: {e}"})
    
    result, code = controller.put_model_version_true(data)
    return jsonify(result), code