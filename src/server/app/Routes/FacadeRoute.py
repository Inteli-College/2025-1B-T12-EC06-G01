from flask import Blueprint, request, jsonify
from app.Controllers.FacadeController import FacadeController

controller = FacadeController()
facade_bp = Blueprint("facade", __name__, url_prefix="/facade")

@facade_bp.route("/get", methods=['POST'])
def get_facades():
    try:
        data = request.json

    except Exception as e:
        print("[FacadeRoute] Erro ao receber requisição!")
        return jsonify({"code": 400, "message": f"{e}"}), 400

    result, code = controller.get_facades(data)  
    return jsonify(result), code  

@facade_bp.route("/", methods=["POST"])
def post_facade():
    try:
        data = request.json

    except Exception as e:
        print("[FacadeRoute] Erro ao receber requisição!")
        return jsonify({"code": 400, "message": f"{e}"}), 400
    
    result, code = controller.post_facade(data)
    return jsonify(result), code