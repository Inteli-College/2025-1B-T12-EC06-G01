from flask import Blueprint, jsonify
from app.Controllers.ProjectController import ProjectController
from app.auth_decorator import token_required

contractor_bp = Blueprint('contractor', __name__)
controller = ProjectController()

@contractor_bp.route('/contractors', methods=['GET'])
@token_required
def get_all_contractors():
    """
    Retorna uma lista de todos os nomes de contratantes únicos
    para serem usados em um dropdown no frontend.
    """
    response, status = controller.get_all_contractors()
    return jsonify(response), status