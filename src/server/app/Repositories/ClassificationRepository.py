from typing import List, Dict
from app.classifier import ModelClassifier

class ClassificationRepository:
    """
    Encapsula a camada de inferência do modelo de detecção/classificação (YOLO).
    """
    def __init__(self):
        # instancia seu wrapper do YOLO
        self.classifier = ModelClassifier()

    def classify_urls(self, urls: List[str]) -> Dict[str, dict]:
        """
        Recebe uma lista de URLs e retorna um dict
        mapeando cada URL ao resultado da inferência.
        """
        results = {}
        for url in urls:
            # use a API do seu modelo aqui; ex: .predict ou .classify
            results[url] = self.classifier.classify_url(url)
        return results
