from typing import Dict
from app.Services.ImageFilterService import ImageFilterService
from app.Repositories.ClassificationRepository import ClassificationRepository
from app import db
from app.Models.Image import Image

class ImageClassificationService:
    def __init__(self):
        self.filter_svc     = ImageFilterService()
        self.classify_repo  = ClassificationRepository()

    def classify_project_images(
        self,
        project_id: int,
        start_date: str = None,
        end_date:   str = None
    ) -> Dict[str, dict]:
        # 1) busca só as imagens com URL válida
        images = self.filter_svc.filter_images(project_id, start_date, end_date)
        urls   = [img.url for img in images]

        # 2) executa o modelo de classificação
        results = self.classify_repo.classify_urls(urls)

        # 3) persiste cada predição no próprio registro da Image
        for img in images:
            outcome = results.get(img.url)
            if not outcome:
                continue
            img.fissure_type = outcome.get("type")
            img.verdict      = outcome.get("verdict")
            db.session.add(img)

        db.session.commit()
        return results
