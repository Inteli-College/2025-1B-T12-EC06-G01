from flask import jsonify, request
from app.Services.ImageDetectionService import ImageDetectionService

class DetectionController:
    def __init__(self):
        self.detect_service = ImageDetectionService()

    def postDetect(self, facade_id):
        """
        Endpoint POST /detect/facades/<facade_id>
        Espera JSON opcional com start_date e end_date.
        Retorna dict onde cada chave é a URL e o valor é
        a string Base64 da imagem anotada com caixas 'npe'.
        """
        data  = request.get_json(force=True) or {}
        start = data.get("start_date")
        end   = data.get("end_date")

        try:
            results = self.detect_service.detect_facade_images(
                facade_id,
                start,
                end
            )
            return jsonify(results), 200

        except ValueError as e:
            return jsonify({"error": f"formato de data inválido: {e}"}), 400
        except Exception as e:
            return jsonify({"error": f"erro interno: {e}"}), 500