from typing import Dict, List
from app.Services.ImageFilterService import ImageFilterService
from app.Repositories.ClassificationRepository import ClassificationRepository
from app import db
from app.Models.image import Image
from app.Repositories.FissureRepository import FissureRepository

class ImageClassificationService:
    def __init__(self):
        self.filter_svc    = ImageFilterService()
        self.classify_repo = ClassificationRepository()
        self.fissure_repo = FissureRepository()

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
        path = self.classify_repo.read_version_path()
        results = self.classify_repo.classify_urls(urls)

        """
        Mostrar na apresentação todas as partes onde está modulado
        """

        classificadas, objetos = self.fissure_repo.read_fissures()

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
            print("\n Aqui papai: ", classificadas)

            if fissure_class in classificadas:
                classificadas[fissure_class].append(raw_url)

            img_obj = Image.query.filter_by(raw_image=raw_url).first()
            if img_obj:
                for fiss in objetos:
                    if str(fiss.fissure_name) == str(class_key):
                        real_id = int(fiss.id)

                img_obj.fissure_id = real_id

                db.session.add(img_obj)

        db.session.commit()
        return classificadas
