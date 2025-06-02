from flask import Blueprint, request, jsonify
from app.Controllers.ProjectController import ProjectController

# Crie um Blueprint para as rotas de projeto
project_blueprint = Blueprint('project', __name__, url_prefix='/projects')

# Instancie o controller
project_controller = ProjectController()

@project_blueprint.route('/<int:project_id>/name', methods=['PUT'])
def update_project_name(project_id):
    """
    Atualiza o nome de um projeto específico
    ---
    parameters:
      - name: project_id
        in: path
        type: integer
        required: true
        description: ID do projeto a ser atualizado
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              description: Novo nome do projeto
          required:
            - name
    responses:
      200:
        description: Nome do projeto atualizado com sucesso
      400:
        description: Dados de entrada inválidos
      404:
        description: Projeto não encontrado
      500:
        description: Erro interno do servidor
    """
    try:
        # Obter os dados da requisição
        data = request.get_json()
        
        # Chamar o controller para atualizar o nome do projeto
        response, status_code = project_controller.update_project_name(project_id, data)
        
        return jsonify(response), status_code
    except Exception as e:
        print(f"[ProjectRoutes] Erro ao receber requisição! 500 - {str(e)}")
        return jsonify({"code": 500, "message": str(e)}), 500
  
@project_blueprint.route("/", methods=["POST"])
def post_project():
    data = request.json
    result, code = project_controller.post_project(data)
    return jsonify(result), code

@project_blueprint.route("/", methods=['GET'])
def get_project():
    result, code = project_controller.get_project()
    return jsonify(result), code