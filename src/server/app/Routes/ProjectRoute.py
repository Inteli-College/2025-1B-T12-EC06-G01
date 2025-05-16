from flask import Blueprint, request, jsonify
from app.Controllers.ProjectController import ProjectController

controller = ProjectController()
project_bp = Blueprint("project", __name__, url_prefix="/project")

@project_bp.route("/", methods=["POST"])
def project_route():
    data = request.json
    images = request.files
    result, code = controller.post_project(data, images)
    return jsonify(result), code