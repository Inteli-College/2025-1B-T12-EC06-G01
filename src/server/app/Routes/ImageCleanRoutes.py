from flask import Blueprint, jsonify, current_app
from app.Controllers.ImageCleanController import ImageCleanController

# Cria um Blueprint para as rotas de limpeza de imagem
image_clean_blueprint = Blueprint('image_clean', __name__, url_prefix='/api/images')

# Instancia o controller
image_clean_controller = ImageCleanController()

@image_clean_blueprint.route('/<int:image_id>/clean', methods=['PUT'])
def clean_image(image_id):
    """
    Limpa os dados de imagem (raw_image e fresh_img) para uma imagem específica
    e deleta as imagens correspondentes do Cloudinary
    ---
    parameters:
      - name: image_id
        in: path
        type: integer
        required: true
        description: ID da imagem a ser limpa
    responses:
      200:
        description: Imagem limpa com sucesso e removida do Cloudinary
      404:
        description: Imagem não encontrada
      500:
        description: Erro interno do servidor
    """
    try:
        # Chama o controller para limpar a imagem
        response, status_code = image_clean_controller.clean_image(image_id)
        
        # Registrar resultado da operação nos logs
        if status_code == 200:
            current_app.logger.info(f"Imagem {image_id} limpa com sucesso e removida do Cloudinary")
        
        return jsonify(response), status_code
    except Exception as e:
        current_app.logger.error(f"Erro ao processar limpeza da imagem {image_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Para registrar este blueprint no seu app:
# from app.Routes.ImageCleanRoutes import image_clean_blueprint
# app.register_blueprint(image_clean_blueprint)
