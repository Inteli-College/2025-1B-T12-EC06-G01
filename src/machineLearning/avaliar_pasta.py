import os
from ultralytics import YOLO

# Caminho para a pasta com subpastas de imagens
image_folder = r"C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/dataset/test"

# Carrega o modelo
model = YOLO("melhores_modelos/best21.pt")

# Extensões de imagens válidas
valid_exts = [".jpg", ".jpeg", ".png", ".bmp"]

# Loop recursivo
for root, dirs, files in os.walk(image_folder):
    for filename in files:
        if any(filename.lower().endswith(ext) for ext in valid_exts):
            image_path = os.path.join(root, filename)
            results = model(image_path)
            predicted_class = results[0].probs.top1
            confidence = results[0].probs.top1conf.item()
            print(f"{filename} → Classe prevista: {predicted_class} (confiança: {confidence:.2f})")
