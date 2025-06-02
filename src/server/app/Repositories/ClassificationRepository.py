import os
import tempfile
import requests
from typing import List, Dict
from ultralytics import YOLO

class ClassificationRepository:
    def __init__(self):
        # aponte para o peso “best.pt” gerado pelo seu treinamento
        self.model = YOLO("src/machineLearning/yolo11n-cls.pt")

    def classify_urls(self, urls: List[str]) -> Dict[str, dict]:
        results = {}
        for url in urls:
            try:
                # 1) baixa imagem
                resp = requests.get(url, timeout=5)
                resp.raise_for_status()
                ext = os.path.splitext(url)[1] or ".jpg"
                with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
                    tmp.write(resp.content)
                    tmp_path = tmp.name

                # 2) faz a inferência (modelo de classificação)
                preds = self.model.predict(
                    source=tmp_path,
                    imgsz=224,
                    device="cpu",
                    verbose=False
                )
                probs = preds[0].probs
                class_id = int(probs.top1)
                confidence = float(probs.top1conf)
                label = self.model.names[class_id]

                results[url] = {
                    "class":      label,
                    "confidence": confidence
                }
            except Exception as e:
                results[url] = {"error": str(e)}
            finally:
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass

        return results
