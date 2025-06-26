# app/Repositories/DetectionRepository.py
import os
import tempfile
import requests
import io
import cv2
import cloudinary.uploader
from ultralytics import YOLO

class DetectionRepository:
    def __init__(self):
        project_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../..")
        )
        self.model_path = os.path.join(
            project_root,
            "src",
            "machineLearning",
            "melhores_modelos",
            "best_detect.pt"
        )
        self.model = None

    def _load_model(self):
        if self.model is None:
            print("--- Loading YOLO detection model for the first time ---")
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(
                    f"Model file not found at: {self.model_path}"
                )
            self.model = YOLO(self.model_path)

    def _upload_to_cloudinary(self, image_bytes: bytes) -> str:
        """
        Faz upload dos bytes da imagem anotada para o Cloudinary e retorna a URL segura.
        """
        result = cloudinary.uploader.upload(
            io.BytesIO(image_bytes),
            folder="detected-images",
            resource_type="image"
        )
        return result.get("secure_url")

    def detect_urls(self, urls: list[str]) -> dict[str, str]:
        """
        Para cada URL, faz inferência, filtra apenas caixas com label 'fissura',
        desenha essas caixas, faz upload da imagem resultante e retorna
        mapeamento original_url -> cloudinary_url.
        """
        self._load_model()
        out = {}

        for url in urls:
            tmp_path = None
            try:
                # 1) download
                resp = requests.get(url, timeout=5)
                resp.raise_for_status()
                ext = os.path.splitext(url)[1] or ".jpg"
                with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
                    tmp.write(resp.content)
                    tmp_path = tmp.name

                # 2) inferência
                preds = self.model.predict(
                    source=tmp_path,
                    imgsz=640,
                    device="cpu",
                    verbose=False
                )[0]

                # 3) carregar com OpenCV
                img = cv2.imread(tmp_path)
                if img is None:
                    raise RuntimeError("Erro ao ler imagem com OpenCV")

                # 4) desenhar apenas 'fissura'
                for box in preds.boxes:
                    cls_id = int(box.cls[0])
                    label = self.model.names[cls_id].lower()
                    if label != "fissura":
                        continue
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    conf = float(box.conf[0])
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    text = f"{label} {conf:.2f}"
                    cv2.putText(
                        img, text, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1
                    )

                # 5) codificar para JPEG em memória
                success, buffer = cv2.imencode('.jpg', img)
                if not success:
                    raise RuntimeError("Falha ao codificar JPEG")
                image_bytes = buffer.tobytes()

                # 6) upload para Cloudinary
                cloud_url = self._upload_to_cloudinary(image_bytes)
                out[url] = cloud_url

            except Exception as e:
                out[url] = {"error": str(e)}

            finally:
                if tmp_path and os.path.exists(tmp_path):
                    os.remove(tmp_path)

        return out
