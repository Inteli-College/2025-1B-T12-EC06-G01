from flask import Blueprint, jsonify
from app.Controllers.ImageProjectController import ImageProjectController

image_project_bp = Blueprint('image_project', __name__, url_prefix='/images')

# já temos o controller instanciado
image_controller = ImageProjectController()

@image_project_bp.route('/project/<int:project_id>', methods=['GET'])
def get_images_by_project(project_id):
    # chama o método do controller, passando o project_id que quer buscar as imagens
    images = image_controller.get_images_by_project(project_id)
    
    image_data = [{
        "id": img.id,
        "raw_image": img.raw_image,
        "fresh_img": img.fresh_img,
        "fissure_type": img.fissure_type,
        "veredict": img.veredict,
        "fachada": img.fachada,
        "building_id": img.building_id,
        "datetime": img.datetime
    } for img in images]

    return jsonify(image_data), 200