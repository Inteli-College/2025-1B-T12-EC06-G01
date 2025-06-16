import os
import tempfile
import requests
from typing import List, Dict
from ultralytics import YOLO
from app.Models.model_version import ModelVersion
from app import db

class ClassificationRepository:
    def __init__(self):
        # ALTERAÇÃO 1: Guardamos apenas o CAMINHO do modelo, não o modelo em si.
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        self.model_path = os.path.join(project_root, "src", "machineLearning", "melhores_modelos", "best21.pt")

        
        # ALTERAÇÃO 2: O modelo começa como None. Ele ainda não foi carregado na memória.
        self.model = None

    def _load_model(self):
        """Método interno para carregar o modelo somente quando necessário."""
        # Se o modelo ainda não foi carregado, carregue-o.
        if self.model is None:
            print("--- Loading YOLO model for the first time ---")
            # Verifica se o arquivo realmente existe antes de tentar carregar
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at: {self.model_path}")
            self.model = YOLO(self.model_path)

    def classify_urls(self, urls: List[str]) -> Dict[str, dict]:
        self._load_model()
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
    
    @staticmethod
    def create_new_version(version: str, train_directory: str):
        try:
            modelo_real = ModelVersion.query.filter_by(real_model=True).first()
            if modelo_real:
                modelo_real.real_model = False

            new = ModelVersion(version=version, real_model=True, train_directory=train_directory)
            db.session.add(new)
            db.session.commit()
            return new, 201

        except Exception as e:
            print(f"[ClassificationRepository] Algo deu errado ao consultar o banco de dados: {e}")
            return f"Algo deu errado ao consultar o banco de dados... {e}", 500
