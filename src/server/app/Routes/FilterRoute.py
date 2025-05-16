from flask import Blueprint, request
from app.Controllers.ImageReviewController import ImageReviewController

ctrl      = ImageReviewController()
filter_bp = Blueprint("filter", __name__, url_prefix="/projects/<int:project_id>/filter")

@filter_bp.route("/images", methods=["GET"])
def filter_images_route(project_id):
    """
    GET /projects/<project_id>/filter/images
    Query params:
      - start_date (ISO-8601, opcional)
      - end_date   (ISO-8601, opcional)
      - order      (asc|desc, opcional)
    """
    return ctrl.get_filtered_images(project_id)