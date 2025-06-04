from flask import Blueprint, abort, current_app
import requests
import numpy as np
import cv2
from uuid import uuid4
import cloudinary.uploader
#tem que fazer pip install python_dotenv
from dotenv import load_dotenv
import os
from io import BytesIO

from app.extensions import db 
from app.Models.image import Image
from app.Controllers.PincelController import PincelController

# Carrega variáveis do .env
load_dotenv()

# Configura Cloudinary
import cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

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
    image_rec = Image.query.get_or_404(image_id)

    img_path = image_rec.raw_image
    if img_path.startswith(('http://', 'https://')):
        print(f"[DEBUG] URL recebida: {img_path}")
        try:
            headers = {'User-Agent': 'brunofab/5.0'}
            resp = requests.get(img_path, headers=headers)
            print(f"Baixando imagem de: {img_path}")
            resp.raise_for_status()
        except requests.RequestException:
            print(f"Erro ao baixar imagem")
            abort(404, description="Arquivo remoto não encontrado")
        data = np.frombuffer(resp.content, np.uint8)
        img = cv2.imdecode(data, cv2.IMREAD_COLOR)
        if img is None:
            abort(500, description="Falha ao decodificar imagem remota")
    else:
        abort(400, description="Somente imagens via URL são suportadas nesta versão")

    # Aplica a operação
    func = OPERATIONS.get(operation)
    if not func:
        abort(404, description=f"Operação '{operation}' não suportada")
    result = func(img)

    # Codifica a imagem para bytes em memória
    success, buffer = cv2.imencode('.png', result)
    if not success:
        abort(500, description="Falha ao codificar a imagem")
    byte_stream = BytesIO(buffer.tobytes())

    # Faz o upload direto para o Cloudinary
    upload_result = cloudinary.uploader.upload(byte_stream, public_id=f"processed_{uuid4().hex}")
    image_url = upload_result.get("secure_url")
    if not image_url:
        abort(500, description="Falha ao obter URL da imagem no Cloudinary")

    # Atualiza o registro
    image_rec.fresh_img = image_url
    print("[DATABASE URI (rota)]:", current_app.config['SQLALCHEMY_DATABASE_URI'])
    db.session.commit()
    print(f"[DEBUG] fresh_img atualizado para: {image_rec.fresh_img}")

    return f'<img src="{image_url}" alt="Imagem Processada">'
