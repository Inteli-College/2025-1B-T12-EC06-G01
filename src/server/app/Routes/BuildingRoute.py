from flask import Blueprint, request, jsonify
from app.Controllers.BuildingController import BuildingController

controller = BuildingController()
building_bp = Blueprint("building", __name__, url_prefix="/building")

@building_bp.route("/", methods=["POST"])
def project_route():
    try:
        data = request.json

    except Exception as e:
        print("[BuildingRoute] Erro ao receber requisição!")
        return jsonify({"code": 400, "message": f"{e}"})
    
    result, code = controller.post_building(data)
    return jsonify(result), code