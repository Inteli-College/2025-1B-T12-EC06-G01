from flask import Blueprint, request, jsonify
from app.Controllers.BuildingController import BuildingController

controller = BuildingController()
building_bp = Blueprint("building", __name__, url_prefix="/building")

@building_bp.route("/", methods=["POST"]) 
def create_building_route(): 
    try:
        data = request.json
    except Exception as e:
        print("[BuildingRoute] Erro ao receber requisição POST!")
        return jsonify({"code": 400, "message": f"{e}"}), 400
    
    result, code = controller.post_building(data)
    return jsonify(result), code

@building_bp.route("/", methods=["GET"])
def get_buildings_route():
    """
    Rota para buscar todos os prédios.
    """
    try:
        result, code = controller.get_buildings()
        return jsonify(result), code
    except Exception as e:
        print(f"[BuildingRoute] Erro ao processar requisição GET: {e}")
        return jsonify({"code": 500, "message": "Erro interno no servidor"}), 500
