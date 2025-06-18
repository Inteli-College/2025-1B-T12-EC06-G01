from flask import jsonify
import os, sys
from app.Services.ImageClassificationService import ImageClassificationService
from app.Repositories.ImageRepository import ImageRepository
from app.Repositories.FissureRepository import FissureRepository

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()
        self.image_repository = ImageRepository()
        self.fissure_repository = FissureRepository()

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

    

    def retrain(self):
        
        result, code = self.image_repository.read_veredict_images_per_facade()
        fissures, code2 = self.fissure_repository.read_fissure_types()

        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        
        from app.Utils.DiretoryUtil import DiretoryUtil
        util = DiretoryUtil(root_dir=root_dir)

        util.all_fissures(fissures=fissures)

        # Faz o download das imagens pegadas do banco de dados
        print(f"CODIGOS PAPAI CODIGO1: {code}, CODIGO2: {code2}")
        if code == 200 and code2 == 200:
            result4, code = util.download_images(result=result) 
            if code != 201:
                return {"code": code, "message": result4}, code

        # Organiza diretório src para importação de dependência do machineLearning
        root_src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        if root_src_path not in sys.path:
            sys.path.insert(0, root_src_path)

        # Importação para separação do dataset e treinamento
        from machineLearning.split_real import real_split
        from machineLearning.train import train_model
        from app.websocket import handle_training
        
        # Separaração do dataset
        real_split()

        # Re-Treinamento
        handle_training(train_model=train_model)   

        return {
            "code": 200,
            "message": "Treinamento iniciado!"
        }    


        
