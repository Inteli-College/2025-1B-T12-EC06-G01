from ultralytics import YOLO
import os

model = YOLO("/runs/classify/train11/weights/best.pt")

test_folder = "C:/Users/pietr/Documents/modulo6/generalizacao"

print(model.names)

# Faz a previsão para cada imagem
for file in os.listdir(test_folder):
    if file.endswith(".jpg") or file.endswith(".PNG"):
        path = os.path.join(test_folder, file)
        results = model.predict(path)
        probs = results[0].probs
        classe_prevista = probs.top1
        confianca = probs.top1conf
        print(f"{file} → Classe prevista: {classe_prevista} ({confianca:.2f} de confiança)")