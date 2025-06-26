from flask import Blueprint, request, jsonify, g
from app.Controllers.UserController import UserController
from app.auth_decorator import token_required 

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

# Rota de Cadastro de Usuário
@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json
    response, status = user_controller.register(data)
    return jsonify(response), status

# Rota de Login de Usuário
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    response, status = user_controller.login(data)
    return jsonify(response), status


# A rota de delete agora usa o prefixo /users
@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    response, status = user_controller.delete_user_by_id(user_id)
    return jsonify(response), status

@user_bp.route('/me', methods=['GET'])
@token_required # Protegemos a rota
def get_current_user():
    # O decorator @token_required já colocou o usuário em g.current_user
    # Não precisamos de lógica no controller, podemos responder diretamente.
    user = g.current_user
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    }), 200
