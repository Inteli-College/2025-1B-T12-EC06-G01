import requests
from datetime import datetime
from typing import List, Optional
from app.Repositories.ImageFilterRepository import ImageFilterRepository

class ImageFilterService:
    def __init__(self):
        self.repo = ImageFilterRepository()

    def filter_images(
        self,
        project_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        order: str = "asc"
    ) -> List[dict]:
        start_dt = datetime.fromisoformat(start_date) if start_date else None
        end_dt   = datetime.fromisoformat(end_date)   if end_date   else None

        imgs = self.repo.get_filtered(project_id, start_dt, end_dt, order)

        valid = []
        for img in imgs:
            url = img.raw_image
            if not url:
                continue
            try:
                resp = requests.head(url, timeout=2)
                if resp.status_code == 200:
                    valid.append(img)
            except requests.RequestException:
                continue

        return [
            {
                "id":           img.id,
                "raw_image":    img.raw_image,
                "datetime":     img.datetime.isoformat(),
                "latitude":     float(img.latitude)  if img.latitude  is not None else None,
                "longitude":    float(img.longitude) if img.longitude is not None else None,
                "fissure_type": img.fissure_type,
                "veredict":     img.veredict
            }
            for img in valid
        ]
