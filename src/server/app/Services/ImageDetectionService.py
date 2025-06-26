from typing import Dict, Optional
from app.Services.ImageFilterService import ImageFilterService
from app.Repositories.DetectionRepository import DetectionRepository

class ImageDetectionService:
    def __init__(self):
        self.filter_svc  = ImageFilterService()
        self.detect_repo = DetectionRepository()

    def detect_facade_images(
        self,
        facade_id: int,
        start_date: Optional[str] = None,
        end_date:   Optional[str] = None
    ) -> Dict[str, str]:
        """
        Retorna para cada URL uma string Base64 da imagem anotada
        apenas com as caixas cujo label seja 'npe'.
        """
        # 1) filtra e carrega URLs
        images = self.filter_svc.filter_images(facade_id, start_date, end_date)
        print(f"[DEBUG] imagens retornadas pelo filter: {images}")

        urls   = [img["raw_image"] for img in images]

        # 2) roda detecção e retorna mapping URL -> base64 image
        annotated_images = self.detect_repo.detect_urls(urls)

        return annotated_images