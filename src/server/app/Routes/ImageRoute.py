from flask import Blueprint, request, jsonify
from app.Controllers.ImageController import ImageController



image_bp = Blueprint('image', __name__)
image_controller = ImageController()

@image_bp.route('/images', methods=['DELETE'])
def delete_images():
    data = request.get_json()
    image_ids = data.get('image_ids', [])
    
    response, status_code = image_controller.delete_images(image_ids)
    return jsonify(response), status_code 

@image_bp.route('/images', methods=['GET'])
def get_images_by_building():
    building_id = request.args.get('building_id', type=int)
    response, status = image_controller.get_images_by_building(building_id)
    return jsonify(response), status
