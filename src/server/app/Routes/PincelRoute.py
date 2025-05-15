from flask import Blueprint, abort, send_file
from io import BytesIO
import cv2, os

from app import db
from Models.image import Image
from Controllers.PincelController import PincelController

pincel_route_bp = Blueprint("classify", __name__, url_prefix="/pincel")

OPERATIONS = {
    'cinza': PincelController.cinza,
    'blur': PincelController.blur,
    'inversao': PincelController.inversao_cores,
    'contraste': PincelController.aumento_contraste,
    'sharpen': PincelController.sharpen,
    'bordas': PincelController.deteccao_bordas,
}

@pincel_route_bp.route('/edit/<int:image_id>/<operation>', methods=['GET'])
def edit_image(image_id, operation):
    # 1) Busca no banco
    image_rec = Image.query.get(image_id)
    if not image_rec:
        abort(404, description="Imagem não encontrada")

    # 2) Carrega o arquivo
    img_path = image_rec.raw_image
    if not os.path.exists(img_path):
        abort(404, description="Arquivo não encontrado")
    img = cv2.imread(img_path)
    if img is None:
        abort(500, description="Falha ao ler a imagem")

    # 3) Escolhe operação
    func = OPERATIONS.get(operation)
    if not func:
        abort(404, description=f"Operação '{operation}' não suportada")

    # 4) Processa
    result = func(img)

    # 5) Retorna PNG
    success, buffer = cv2.imencode('.png', result)
    if not success:
        abort(500, description="Erro ao codificar imagem")
    return send_file(
        BytesIO(buffer.tobytes()),
        mimetype='image/png',
        download_name=f"{operation}_{image_id}.png"
    )
