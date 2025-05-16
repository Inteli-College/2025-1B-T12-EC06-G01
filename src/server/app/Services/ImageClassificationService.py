# app/Services/ImageClassificationService.py
from typing import Dict
from app.Services.ImageFilterService import ImageFilterService
from app.Repositories.ClassificationRepository import ClassificationRepository

class ImageClassificationService:
    """
    Orquestra pegar as URLs filtradas e chamar o repositório de classificação.
    """
    def __init__(self):
        self.filter_svc     = ImageFilterService()
        self.classify_repo  = ClassificationRepository()

    def classify_project_images(
        self,
        project_id: int,
        start_date: str = None,
        end_date:   str = None
    ) -> Dict[str, dict]:
        # 1) pega lista de imagens já serializadas pelo filter service
        images = self.filter_svc.filter_images(project_id, start_date, end_date)

        # 2) extrai só as URLs
        urls = [img["raw_image"] for img in images]

        # 3) chama o repositório de classificação
        result = self.classify_repo.classify_urls(urls)
        return result
