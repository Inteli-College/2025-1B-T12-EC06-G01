from flask import Blueprint, jsonify, request
from app.Controllers import 

classify_route_bp = Blueprint("classify", __name__, url_prefix="/classify")

@classify_route_bp("/", methods=["POST"])
def classify_route():
    data = request.json
    

