from flask import jsonify
import os, sys
from app.Services.ImageClassificationService import ImageClassificationService
from app.Repositories.ImageRepository import ImageRepository
from app.Repositories.ClassificationRepository import ClassificationRepository
from app.Utils.DiretoryUtil import DirectoryUtil
from app.Repositories.FissureRepository import FissureRepository

class ClassifyController:
    def __init__(self):
        self.classify_service = ImageClassificationService()
        self.image_repository = ImageRepository()
        self.classify_repository = ClassificationRepository()
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
    


    def retrain(self):

        # Recolhe os dados necessários para retreinamento
        result, code = self.image_repository.read_veredict_images_per_facade()
        fissures, code2 = self.fissure_repository.read_fissure_types()

        # Organiza diretório raiz para conseguir acessar as pastas corretas
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        
        util = DirectoryUtil(root_dir=root_dir)

        util.all_fissures(fissures=fissures)

        # Faz o download das imagens pegadas do banco de dados
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
        from app.websocket import handle_training
        
        # Separaração do dataset
        real_split()

        # Treinamento
        handle_training()        

        # Pega a última versão gerada na pasta runs/classify
        versao, latest_train = util.get_train_version()

        # Cria uma nova versão do modelo na tabela model_version no banco de dados
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


        
