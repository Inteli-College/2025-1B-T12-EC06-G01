from flask import request, jsonify
from app.Services.ImageClassificationService import ImageClassificationService

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()

    def postClassify(self, facade_id, data):
        """
        Espera body JSON:
          {
            "project_id": 123,
            "start_date": "2025-05-01T00:00:00",  # opcional
            "end_date":   "2025-05-14T23:59:59"   # opcional
          }
        """

        start = data.get("start_date")
        end   = data.get("end_date")

        try:
            results = self.classify_service.classify_project_images(
                facade_id, start, end
            )
        except ValueError as e:
            return jsonify({"error": f"formato de data inválido: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": f"erro interno: {str(e)}"}), 500

        return jsonify(results), 200
