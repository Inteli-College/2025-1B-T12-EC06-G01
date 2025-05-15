import os
import requests
import tempfile
from app.Services.ImageFilterService import ImageFilterService
# from app.classifier import ModelClassifier   # classe do modelo para importar

class ImageClassificationService:
    def __init__(self):
        self.filter_svc     = ImageFilterService()
        # self.classifier     = ModelClassifier()

    def classify_project_images(
        self,
        project_id: int,
        start_date: str = None,
        end_date:   str = None
    ) -> dict:
        # 1) pega a lista filtrada
        images = self.filter_svc.filter_images(project_id, start_date, end_date)

        # 2) cria pasta temporária e baixa tudo lá
        with tempfile.TemporaryDirectory() as tmpdir:
            files = []
            for img in images:
                url      = img["raw_image"]
                out_path = os.path.join(tmpdir, f"{img['id']}.jpg")
                resp     = requests.get(url)
                resp.raise_for_status()
                with open(out_path, "wb") as f:
                    f.write(resp.content)
                files.append(out_path)

            # 3) chama o modelo passando o diretório
            # result = self.classifier.classify_folder(tmpdir)

        # 4) pasta é deletada ao sair do with
        # return result
