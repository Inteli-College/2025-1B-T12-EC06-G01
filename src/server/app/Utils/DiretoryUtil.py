import os, uuid, requests, re
from app.Repositories.ImageRepository import ImageRepository

class DirectoryUtil:
    def __init__(self, root_dir):
        self.__root_dir = root_dir
        self.__fissure_dict = {}
        self.image_repo = ImageRepository()
        pass

    def all_fissures(self, fissures):
        fissure_dict = {}
        for fissura in fissures:
            nome_fissura = fissura[0]
            dir_path = os.path.join(self.__root_dir, "machineLearning", "imagens_raw", f"fissura_{nome_fissura}")
            os.makedirs(dir_path, exist_ok=True)
            fissure_dict[nome_fissura] = dir_path
        self.__fissure_dict = fissure_dict

    def download_images(self, result):
        for image in result:
            url = str(image.raw_image)
            file_name = f"{uuid.uuid4().hex}.jpg"
            response = requests.get(url)
            dir_path = self.__fissure_dict.get(str(image.veredict), "")

            if response.status_code == 200:
                output_path = os.path.join(dir_path, file_name)

                with open(output_path, "wb") as f:
                    f.write(response.content)
                
                msg, code = self.image_repo.put_image_name(image=image, new_name=file_name)

                if not code == 204:
                    return msg, code

                print("Imagem baixada com sucesso!")

        return "Imagens baixadas com sucesso!", 201
    
    def get_train_version(self):
        classify_runs_path = os.path.join(self.__root_dir, "machineLearning", "runs", "classify")
        train_dirs = [
            d for d in os.listdir(classify_runs_path)
            if os.path.isdir(os.path.join(classify_runs_path, d)) and d.startswith("train")
        ]

        if not train_dirs:
            return {"code": 500, "message": "Nenhuma pasta de treino encontrada."}, 500

        # Ordenar pelas datas de criação
        train_dirs.sort(key=lambda d: os.path.getctime(os.path.join(classify_runs_path, d)), reverse=True)
        latest_train_path = str(os.path.join(classify_runs_path, train_dirs[0]))
        match = re.search(r'[^/\\]+$', latest_train_path)

        if match:
            versao = match.group()
        else:
            return 

        return versao, latest_train_path