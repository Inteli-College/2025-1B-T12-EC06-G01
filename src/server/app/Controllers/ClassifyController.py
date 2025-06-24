from flask import jsonify
import os, sys
from app.Services.ImageClassificationService import ImageClassificationService
from app.Repositories.ImageRepository import ImageRepository
from app.Repositories.FissureRepository import FissureRepository
from app.Utils.DiretoryUtil import DiretoryUtil
from app.Repositories.ClassificationRepository import ClassificationRepository

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()
        self.image_repository = ImageRepository()
        self.fissure_repository = FissureRepository()
        self.classify_repository = ClassificationRepository()
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        self.diretory_util = DiretoryUtil(self.root_dir)

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
        
        from app.Utils.DiretoryUtil import DiretoryUtil
        self.diretory_util = DiretoryUtil(root_dir=self.root_dir)

        self.diretory_util.all_fissures(fissures=fissures)

        # Faz o download das imagens pegadas do banco de dados
        print(f"CODIGOS PAPAI CODIGO1: {code}, CODIGO2: {code2}")
        if code == 200 and code2 == 200:
            result4, code = self.diretory_util.download_images(result=result) 
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
    
    def get_model_version(self):
        version_name, version_path, acuracia = self.diretory_util.get_train_version()
        if version_path == 500:
            return {"code": 500, "message": version_name}
        
        result_name, code = self.classify_repository.read_version_name(name=version_name)

        if code != 200:
            return {"code": code, "message": result_name}, code

        if not result_name:
            result_version, code = self.classify_repository.create_new_version(version=version_name, train_directory=version_path, accuracy=acuracia)
            if code != 201:
                return {"code": code, "message": result_name}, code
            else:
                print("[ClassifyController] Nova versão adicionada no banco!")
        
        all_versions, code = self.classify_repository.read_all_version()

        if code != 200:
            return {"code": code, "message": all_versions}, code
        else:
            resultados = []
            for registro in all_versions:
                resultados.append({
                    "id": registro.id,
                    "version": registro.version,
                    "accuracy": registro.accuracy,
                    "created_at": registro.train_directory,
                })

            return resultados, code

    def put_model_version_true(self, data):
        try:
            id_versao = data['version_id']
        
        except Exception as e:
            print("[ClassifyController] Os conteúdos do json não são suficientes...")
            return {"code": 400, "message": "Os conteúdos do json não são suficientes..."}, 400
        
        result, code = self.classify_repository.update_version_true(version_id=id_versao)

        if code == 201:
            return {
                "version": result.version,
                "real_model": result.real_model
            }, 201
        
        else:
            return {"code": code, "message": result}, code



        
