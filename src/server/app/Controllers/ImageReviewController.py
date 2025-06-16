from flask import request, jsonify
from app.Services.ImageFilterService import ImageFilterService
from app.Services.ImageClassificationService import ImageClassificationService

class ImageReviewController:
    def __init__(self):
        self.filter_svc = ImageFilterService()
        self.classify_svc = ImageClassificationService()

    def get_filtered_images(self, facade_id):
        start = request.args.get("start_date") # O usuário poderá filtrar por intervalo de tempo das imagens
        end   = request.args.get("end_date")
        order = request.args.get("order", "asc") # O usuário poderá ordernar de forma crescenete ou decrescente

        try:
            data = self.filter_svc.filter_images(facade_id, start, end, order) # Todos os filtros são opcionais
        except ValueError:
            return jsonify({"error": "formato de data inválido"}), 400

        return jsonify(data), 200

    def classify_images(self, project_id):
        """
        Recebe JSON opcional com start_date/end_date,
        chama o service de classificação e retorna resultado.
        """
        payload = request.json or {}
        start   = payload.get("start_date")
        end     = payload.get("end_date")

        try:
            res = self.classify_svc.classify_project_images(project_id, start, end)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify(res), 200
