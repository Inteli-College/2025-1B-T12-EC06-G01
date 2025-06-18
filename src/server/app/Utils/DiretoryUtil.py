import os, uuid, requests, re
from app.Repositories.ImageRepository import ImageRepository
from app.Repositories.ClassificationRepository import ClassificationRepository
from app.websocket import send_message


class DiretoryUtil:
    def __init__(self, root_dir):
        self.__root_dir = root_dir
        self.__fissure_dict = {}
        self.image_repo = ImageRepository()
        self.classify_repository = ClassificationRepository()
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
        if len(result) == 0:
            return "Nenhuma imagem para download", 404

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
                send_message(f"Baixando imagem {file_name}", "training_progress_fe")

                if not code == 204:
                    return msg, code

                print("\nImagem baixada com sucesso!")

        return "Imagens baixadas com sucesso!", 201

    def get_train_version(self):
        classify_runs_path = os.path.join(self.__root_dir, "machineLearning", "runs", "classify")
        
        train_dirs = [
            d for d in os.listdir(classify_runs_path)
            if os.path.isdir(os.path.join(classify_runs_path, d)) and re.match(r"train_\d{8}_\d{6}", d)
        ]

        if not train_dirs:
            return "Nenhuma pasta de treino encontrada.", 500

        train_dirs.sort(reverse=True)

        latest_dir_name = train_dirs[0]
        latest_dir_path = os.path.join(classify_runs_path, latest_dir_name)

        match = re.search(r"2025-1B-T12-EC06-G01(.*)", latest_dir_path)
        if match:
            latest_dir_path = match.group(1)

        # Cria uma nova versão do modelo na tabela model_version no banco de dados
        return latest_dir_name, latest_dir_path