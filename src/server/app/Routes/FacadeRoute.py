from flask import Blueprint, request, jsonify
from app.Controllers.FacadeController import FacadeController

controller = FacadeController()
facade_bp = Blueprint("facade", __name__, url_prefix="/facade")

@facade_bp.route("/building/<int:building_id>", methods=['GET'])
def get_facades_by_building(building_id):
    """
    Rota RESTful para buscar fachadas de um prédio específico.
    """
    try:
        # Simula o formato esperado pelo controller existente
        data = {"building_id": building_id}
        result, code = controller.get_facades(data)
        return jsonify(result), code
    except Exception as e:
        print(f"[FacadeRoute] Erro ao processar requisição GET: {e}")
        return jsonify({"code": 500, "message": "Erro interno no servidor"}), 500

@facade_bp.route("/", methods=["POST"])
def post_facade():
    try:
        data = request.json

    except Exception as e:
        print("[FacadeRoute] Erro ao receber requisição!")
        return jsonify({"code": 400, "message": f"{e}"}), 400
    
    result, code = controller.post_facade(data)
    return jsonify(result), code

@facade_bp.route("/", methods=["PUT"])
def put_new_facade_name():
    try:
        data = request.json
    except Exception as e:
        print("[FacadeRoute] Erro ao receber requisição POST!")
        return jsonify({"code": 400, "message": f"Erro ao receber requisição: {e}"})
    
    result, code = controller.put_new_facade_name(data)
    return jsonify(result), code
