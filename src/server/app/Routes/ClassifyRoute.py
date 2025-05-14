from flask import Blueprint, request
from app.Controllers.ClassifyController import ClassifyController

classify_inst = ClassifyController()

classify_bp = Blueprint("classify", __name__, url_prefix="/classify")

@classify_bp.route("/", methods=["POST"])
def classify_route():
    data = request.json
    return classify_inst.postClassify(data)
    

