# app/Routes/ClassifyRoute.py
from flask import Blueprint, request
from app.Controllers.ClassifyController import ClassifyController

classify_ctrl = ClassifyController()
classify_bp   = Blueprint("classify", __name__, url_prefix="/classify")

@classify_bp.route("/", methods=["POST"])
def classify_route():
    return classify_ctrl.postClassify(request.json)
