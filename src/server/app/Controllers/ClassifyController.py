from flask import request, jsonify
import requests, os, uuid, sys
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
            target_facade_id = int(data['facade_id'])
        
        except Exception as e:            
            print("[ClassifyController] Os conteúdos json não são suficiente")
            return {"code": 400, "message": f"Os conteúdos json não são suficientes: {e}"}, 400
        
        result, code = self.image_repository.read_veredict_images_per_facade(facade_id=target_facade_id)
        fissures, code2 = self.image_repository.read_fissure_types()
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        
        fissure_dict = {}
        for fissura in fissures:
            nome_fissura = fissura[0]
            dir_path = os.path.join(root_dir, "machineLearning", "imagens_raw", f"fissura_{nome_fissura}")
            os.makedirs(dir_path, exist_ok=True)
            fissure_dict[nome_fissura] = dir_path
        

        if code == 200 and code2 == 200:
            for image in result:
                url = str(image.raw_image)
                file_name = f"{uuid.uuid4().hex}.jpg"
                response = requests.get(url)
                dir_path = fissure_dict.get(str(image.veredict), "")

                if response.status_code == 200:
                    output_path = os.path.join(dir_path, file_name)

                    with open(output_path, "wb") as f:
                        f.write(response.content)

                    print("Imagem baixada com sucesso!")

        root_src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        print(root_src_path)

        if root_src_path not in sys.path:
            sys.path.insert(0, root_src_path)

        from machineLearning.split_real import real_split
        from machineLearning.train import train_model

        real_split()
        # train_model()         

        classify_runs_path = os.path.join(root_dir, "machineLearning", "runs", "classify")
        train_dirs = [
            d for d in os.listdir(classify_runs_path)
            if os.path.isdir(os.path.join(classify_runs_path, d)) and d.startswith("train")
        ]

        if not train_dirs:
            return {"code": 500, "message": "Nenhuma pasta de treino encontrada."}, 500

        # Ordenar pelas datas de criação
        train_dirs.sort(key=lambda d: os.path.getctime(os.path.join(classify_runs_path, d)), reverse=True)
        latest_train_path = os.path.join(classify_runs_path, train_dirs[0])

        

        

        return {"message": "O modelo começou a retreinar!"}, 200


        
