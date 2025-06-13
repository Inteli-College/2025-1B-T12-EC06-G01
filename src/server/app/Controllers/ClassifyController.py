from flask import request, jsonify
import requests, os

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
        from traceback import print_exc

        start = data.get("start_date")
        end   = data.get("end_date")

        print(f"[DEBUG] Recebido pedido de classificação para fachada {facade_id}")
        print(f"[DEBUG] Período: {start} até {end}")

        try:
            results = self.classify_service.classify_facade_images(
            facade_id, start, end
        )

            print(f"[DEBUG] Resultado retornado pela classificação:", results)
            return jsonify(results), 200

        except ValueError as e:
            print(f"[ERROR] Erro de valor:", e)
            return jsonify({"error": f"formato de data inválido: {str(e)}"}), 400

        except Exception as e:
            print(f"[ERROR] Erro interno ao classificar fachada {facade_id}: {e}")
            print_exc()  # Mostra o traceback completo no terminal
            return jsonify({"error": f"erro interno: {str(e)}"}), 500

    
    def retrain(self, data):
        try:
            target_facade_id = int(data['facade_id'])

        except Exception as e:            
            print("[ClassifyController] Os conteúdos json não são suficiente")
            return {"code": 400, "message": f"Os conteúdos json não são suficientes: {e}"}, 400
        
        result, code = self.image_repository.read_veredict_images_per_facade(facade_id=target_facade_id)
        fissures, code2 = self.image_repository.read_fissure_types()
        
        fissure_dict = {}
        for fissura in fissures:
            nome_fissura = fissura[0]
            dir_path = os.path.join("src", "machineLearning", "imagens_raw", f"fissura_{nome_fissura}")
            os.makedirs(dir_path, exist_ok=True)
            fissure_dict[nome_fissura] = dir_path
        
        print(fissure_dict)

        if code == 200 and code2 == 200:
            for image in result:
                url = str(image.raw_image)
                response = requests.get(url)
                output_path = fissure_dict.get(str(image.veredict), "")

                if response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(response.content)
                    print("Imagem baixada com sucesso!")


        
