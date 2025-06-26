from flask import Blueprint, abort, current_app, jsonify
import requests
import numpy as np
import cv2
from uuid import uuid4
import cloudinary.uploader
from dotenv import load_dotenv
import os
from io import BytesIO

from app import db 
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

@pincel_bp.route('/edit/<int:image_id>/<operation>', methods=['POST'])
def edit_image(image_id, operation):
    try:
        image_rec = Image.query.get(image_id)
        if not image_rec:
            return jsonify({"error": "Imagem não encontrada"}), 404

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
                return jsonify({"error": "Arquivo remoto não encontrado"}), 404
            
            data = np.frombuffer(resp.content, np.uint8)
            img = cv2.imdecode(data, cv2.IMREAD_COLOR)
            if img is None:
                return jsonify({"error": "Falha ao decodificar imagem remota"}), 500
        else:
            return jsonify({"error": "Somente imagens via URL são suportadas nesta versão"}), 400

        # Aplica a operação
        func = OPERATIONS.get(operation)
        if not func:
            return jsonify({"error": f"Operação '{operation}' não suportada"}), 404
        
        result = func(img)

        # Codifica a imagem para bytes em memória
        success, buffer = cv2.imencode('.png', result)
        if not success:
            return jsonify({"error": "Falha ao codificar a imagem"}), 500
        
        byte_stream = BytesIO(buffer.tobytes())

        # Faz o upload direto para o Cloudinary
        upload_result = cloudinary.uploader.upload(byte_stream, public_id=f"processed_{uuid4().hex}")
        image_url = upload_result.get("secure_url")
        if not image_url:
            return jsonify({"error": "Falha ao obter URL da imagem no Cloudinary"}), 500

        # Atualiza o registro   
        db.session.query(Image).filter_by(id=image_id).update({"fresh_img": image_url})
        db.session.commit()
        print(f"[DEBUG] fresh_img atualizado para: {image_url}")

        return jsonify({
            "success": True,
            "message": "Imagem processada com sucesso",
            "image_url": image_url,
            "operation": operation
        })

    except Exception as e:
        print(f"[ERROR] Erro no processamento: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500

@pincel_bp.route('/operations', methods=['GET'])
def get_operations():
    """Retorna lista de operações disponíveis"""
    return jsonify({
        "operations": list(OPERATIONS.keys()),
        "descriptions": {
            "cinza": "Converter para escala de cinza",
            "blur": "Aplicar desfoque",
            "inversao": "Inverter cores",
            "contraste": "Aumentar contraste",
            "sharpen": "Aumentar nitidez",
            "bordas": "Detectar bordas"
        }
    })
