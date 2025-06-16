from flask import Blueprint, request
from app.Controllers.ImageReviewController import ImageReviewController

controller = ImageReviewController()
filter_bp = Blueprint("filter", __name__, url_prefix="/facades/<int:facade_id>/filter")

@filter_bp.route("/images", methods=["GET"])
def filter_images_route(facade_id):
    """
    GET //facades/<int:facade_id>/filter/images
    Query params:
      - start_date (ISO-8601, opcional)
      - end_date   (ISO-8601, opcional)
      - order      (asc|desc, opcional)
    """
    return controller.get_filtered_images(facade_id)