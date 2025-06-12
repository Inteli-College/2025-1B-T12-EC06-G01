from typing import Dict, List
from app.Services.ImageFilterService import ImageFilterService
from app.Repositories.ClassificationRepository import ClassificationRepository
from app import db
from app.Models.image import Image

class ImageClassificationService:
    def __init__(self):
        self.filter_svc    = ImageFilterService()
        self.classify_repo = ClassificationRepository()

    def classify_facade_images(
        self,
        facade_id: int,
        start_date: str = None,
        end_date:   str = None
    ) -> Dict[str, dict]:
        # 1) filtra e carrega URLs
        images = self.filter_svc.filter_images(facade_id, start_date, end_date)
        urls   = [img["raw_image"] for img in images]

        # 2) chama o modelo
        results = self.classify_repo.classify_urls(urls)

        # 3) grava resultados em cada Image do banco
        for serialized in images:
            outcome = results.get(serialized["raw_image"], {})
            if "error" in outcome:
                continue
            img_obj = Image.query.filter_by(raw_image=serialized["raw_image"]).first()
            if not img_obj:
                continue

            img_obj.fissure_type = outcome["class"]
            img_obj.veredict     = outcome["class"]
            db.session.add(img_obj)

        db.session.commit()
        return results
