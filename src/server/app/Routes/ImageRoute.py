from flask import Blueprint, request, jsonify
from app.Controllers.ImageController import ImageController

image_bp = Blueprint('image', __name__, url_prefix="/images")
image_controller = ImageController()

@image_bp.route('/', methods=['DELETE'])
def delete_images():
    data = request.get_json()
    image_ids = data.get('image_ids', [])
    
    response, status_code = image_controller.delete_images(image_ids)
    return jsonify(response), status_code 

@image_bp.route('/', methods=['POST'])
def post_images():
    data = request.json
    files = request.files.getlist('images')
    if not files:
        print("[ImageRoute] Nenhum arquivo de imagem recebido...")
        return jsonify({"code": 400, "message":"Nenhum arquivo associado..."})
    image_controller.post_images(data, files)

@image_bp.route('/', methods=['GET'])
def get_images():
    data = request.json
    return image_controller.get_images(data)

@image_bp.route('/fachadas', methods=['GET'])
def get_fachada():
    data = request.json
    return image_controller.get_fachadas(data)