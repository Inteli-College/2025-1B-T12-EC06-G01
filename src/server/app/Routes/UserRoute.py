from flask import Blueprint, request, jsonify
from app.Controllers.UserController import UserController

# Cria um Blueprint para as rotas do usuário
user_bp = Blueprint('user', __name__)
# Instancie o controller
user_controller = UserController()

# Defina as rotas para manuseio do usuário

@user_bp.route('/get_user_id/<int:user_id>', methods=['GET'])
def get_users_by_id(user_id):
    try:
        user = user_controller.get_user_by_id(user_id)
        # Define estrutura do formato do json do user
        user_data = {
            "id": user.id,
            "name": user.name,
        }

        return jsonify(user_data), 200
    except:
        return jsonify({"error": "User not found"}), 404

@user_bp.route('/get_user_name/<string:name>', methods=['GET'])
def get_users_by_name(name):
    try:
        user = user_controller.get_user_by_name(name)
        user_data = {
            "id": user.id,
            "name": user.name,
        }
        return jsonify(user_data), 200
    except:
        return jsonify({"error": "User not found"}), 404

@user_bp.route('/create_user', methods=['POST'])
def create_user():
    data = request.json
    response, status = user_controller.post_user(data)
    return jsonify(response), status

@user_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    return user_controller.delete_user_by_id(user_id)
