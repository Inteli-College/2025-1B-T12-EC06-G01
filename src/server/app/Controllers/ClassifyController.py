from flask import request, jsonify
import requests
from app.Services.ImageClassificationService import ImageClassificationService
from app.Repositories.ImageRepository import ImageRepository

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()
        self.image_repository = ImageRepository()

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
    
    def retrain(self, data):
        try:
            target_facade_id = data['facade_id']
        
        except Exception as e:            
            print("[ClassifyController] Os conteúdos json não são suficiente")
            return {"code": 400, "message": f"Os conteúdos json não são suficientes: {e}"}, 400
        
        result, code = self.image_repository.read_veredict_images_per_facade(facade_id=target_facade_id)
        fissures = self.image_repository.read_fissure_types()

        if code == 200:
            for image in result:
                url = str(image.raw_img)
                response = request.get(url)
                output_path = {
                    "termic": "termic",
                    "retraction": "retraction"
                }.get(image.veredict, "")


                if response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(response.content)
                    print("Imagem baixada com sucesso!")


        
