from flask import Blueprint, request, jsonify
from app.Controllers.ImageBuildingController import ImageBuildingController


image_building_bp = Blueprint('image_building', __name__)
image_controller = ImageBuildingController()

@image_building_bp.route('/images', methods=['GET'])
def get_images_by_building():
    building_id = request.args.get('building_id', type=int)
    response, status = image_controller.get_images_by_building(building_id)
    return jsonify(response), status
