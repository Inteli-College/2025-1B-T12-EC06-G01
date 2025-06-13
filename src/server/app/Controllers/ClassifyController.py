from flask import request, jsonify
import requests, os, uuid, sys, re
from app.Services.ImageClassificationService import ImageClassificationService
from app.Repositories.ImageRepository import ImageRepository
from app.Repositories.ClassificationRepository import ClassificationRepository
from app.Utils.DiretoryUtil import DirectoryUtil

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()
        self.image_repository = ImageRepository()
        self.classify_repository = ClassificationRepository()

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
            target_facade_id = int(data['facade_id'])
        
        except Exception as e:            
            print("[ClassifyController] Os conteúdos json não são suficiente")
            return {"code": 400, "message": f"Os conteúdos json não são suficientes: {e}"}, 400
        
        result, code = self.image_repository.read_veredict_images_per_facade(facade_id=target_facade_id)
        fissures, code2 = self.image_repository.read_fissure_types()
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))


        util = DirectoryUtil(root_dir=root_dir)
        util.all_fissures(fissures=fissures)
        

        if code == 200 and code2 == 200:
            result, code = util.download_images(result=result) 
            if code != 200:
                return result, code

        root_src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

        if root_src_path not in sys.path:
            sys.path.insert(0, root_src_path)

        from machineLearning.split_real import real_split
        from machineLearning.train import train_model

        real_split()
        """
            SEGUNDA THREAD PARA O MODELO E ATUALIZAR A PORCENTAGEM DO BANCO
        """

        # train_model()         

        versao, latest_train = util.get_train_version()

        result1, code3 = self.classify_repository.create_new_version(version=versao, train_directory=latest_train)

        if code3 == 201:
            return {
                "version_id": result1.id,
                "new_version": result1.version
            }, 201
        else:
            return {
                "code": code3,
                "message": result1
            }


        
