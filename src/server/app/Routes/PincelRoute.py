from flask import Blueprint, abort, send_file, current_app
import requests
import numpy as np
import cv2, os
from uuid import uuid4

from app.extensions import db 
from app.Models.image import Image
from app.Controllers.PincelController import PincelController

pincel_bp = Blueprint("pincel", __name__, url_prefix="/pincel")

OPERATIONS = {
    'cinza': PincelController.cinza,
    'blur': PincelController.blur,
    'inversao': PincelController.inversao_cores,
    'contraste': PincelController.aumento_contraste,
    'sharpen': PincelController.sharpen,
    'bordas': PincelController.deteccao_bordas,
}

@pincel_bp.route('/edit/<int:image_id>/<operation>', methods=['GET'])
def edit_image(image_id, operation):
    # 1) Busca imagem original
    image_rec = Image.query.get_or_404(image_id)

    # 2) Carrega o arquivo (local ou URL)
    img_path = image_rec.raw_image
    if img_path.startswith(('http://', 'https://')):
        try:
            resp = requests.get(img_path, timeout=5)
            resp.raise_for_status()
        except requests.RequestException:
            abort(404, description="Arquivo remoto não encontrado")
        data = np.frombuffer(resp.content, np.uint8)
        img = cv2.imdecode(data, cv2.IMREAD_COLOR)
        if img is None:
            abort(500, description="Falha ao decodificar imagem remota")
    else:
        if not os.path.exists(img_path):
            abort(404, description="Arquivo local não encontrado")
        img = cv2.imread(img_path)
        if img is None:
            abort(500, description="Falha ao ler a imagem local")

    # 3) Aplica a operação
    func = OPERATIONS.get(operation)
    if not func:
        abort(404, description=f"Operação '{operation}' não suportada")
    result = func(img)

    # 4) Gera caminho para salvar imagem processada
    # usa caminho absoluto a partir da raiz do app
    static_folder = os.path.join(current_app.root_path, 'static', 'processed')
    os.makedirs(static_folder, exist_ok=True)
    filename = f"{operation}_{uuid4().hex}.png"
    output_path = os.path.join(static_folder, filename)
    saved = cv2.imwrite(output_path, result)
    if not saved:
        abort(500, description="Falha ao salvar a imagem processada")

    # 5) Atualiza o registro original, salvando o caminho no fresh_img
    # (supondo que fresh_img seja String no seu model; se ainda for Integer,
    # troque o tipo da coluna para String)
    image_rec.fresh_img = os.path.relpath(output_path, current_app.root_path)
    db.session.commit()

    # 6) Retorna a imagem processada
    return send_file(
        output_path,
        mimetype='image/png',
        download_name=filename
    )
