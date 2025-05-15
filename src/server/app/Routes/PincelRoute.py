from flask import Blueprint, abort, send_file
from io import BytesIO
import cv2, os
from datetime import datetime
from uuid import uuid4

from app import db
from Models.image import Image
from Controllers.PincelController import PincelController

pincel_route_bp = Blueprint("pincel", __name__, url_prefix="/pincel")

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
    # 1) Busca imagem original
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

    # 3) Aplica a operação
    func = OPERATIONS.get(operation)
    if not func:
        abort(404, description=f"Operação '{operation}' não suportada")

    result = func(img)

    # 4) Gera caminho para salvar nova imagem
    output_folder = os.path.join("static", "processed")
    os.makedirs(output_folder, exist_ok=True)
    
    new_filename = f"{operation}_{uuid4().hex}.png"
    output_path = os.path.join(output_folder, new_filename)
    cv2.imwrite(output_path, result)

    # 5) Salva nova imagem no banco
    new_image = Image(
        raw_image=output_path,
        fresh_img=None,
        latitude=image_rec.latitude,
        longitude=image_rec.longitude,
        fissure_type=image_rec.fissure_type,
        veredict=image_rec.veredict,
        project_id=image_rec.project_id
    )
    db.session.add(new_image)
    db.session.commit()

    # 6) Atualiza a imagem original com referência à nova imagem
    image_rec.fresh_img = new_image.id
    db.session.commit()

    # 7) Retorna a imagem processada
    return send_file(
        output_path,
        mimetype='image/png',
        download_name=new_filename
    )