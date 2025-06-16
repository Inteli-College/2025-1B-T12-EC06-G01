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
        classificadas = {
            "termica": [],
            "retracao": [],
        }

        for serialized in images:
            raw_url = serialized["raw_image"]
            outcome = results.get(raw_url, {})

            if "error" in outcome:
                continue

            fissure_class = outcome.get("class", "").lower()

            # Mapeia nomes vindos do modelo para os usados internamente
            if "termica" in fissure_class:
                class_key = "termica"
            elif "retracao" in fissure_class:
                class_key = "retracao"
            else:
                continue  # ignora classes irrelevantes

            classificadas[class_key].append(raw_url)

            if fissure_class in classificadas:
                classificadas[fissure_class].append(raw_url)

            img_obj = Image.query.filter_by(raw_image=raw_url).first()
            if img_obj:
                img_obj.fissure_id = 1 if fissure_class == "termica" else 2
                img_obj.veredict = fissure_class
                db.session.add(img_obj)

        db.session.commit()
        return classificadas
