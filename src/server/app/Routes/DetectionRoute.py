# app/Routes/DetectionRoute.py
from flask import Blueprint, request, jsonify
from app.Controllers.DetectionController import DetectionController
from flask_cors import CORS

controller = DetectionController()
detect_bp  = Blueprint("detect", __name__, url_prefix="/detect")
CORS(detect_bp)

@detect_bp.route("/facades/<int:facade_id>", methods=["POST"])
def detect_route(facade_id):
    return controller.postDetect(facade_id)
