from flask import Blueprint, request, jsonify
from app.Controllers.ImageController import ImageController

image_bp = Blueprint('image', __name__, url_prefix="/images")
image_controller = ImageController()
# Controle geral das imagens, pega cada função de seus respectivos controllers e passa o id correto

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
        return jsonify({"code": 400, "message":"Nenhum arquivo associado..."}), 400
    
    result, code = image_controller.post_images(data, files)
    return jsonify(result), code

@image_bp.route('/', methods=['GET'])
def get_images():
    building_id = request.args.get('building_id')
    fachada = request.args.get('fachada')
    data = {
        "building_id": building_id,
        "fachada": fachada
    }   
    result, code = image_controller.get_images_per_fachada(data)
    return jsonify(result), code

@image_bp.route('/classified', methods=['GET'])
def get_images_classified_per_building():
    data = request.json
    result, code = image_controller.get_images_classified_per_building(data)
    return jsonify(result), code
