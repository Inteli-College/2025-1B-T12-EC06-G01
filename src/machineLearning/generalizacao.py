from ultralytics import YOLO
import os

# Caminho para o seu modelo treinado
model = YOLO("C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/runs/classify/train5/weights/best.pt")

# Caminho para as imagens modificadas
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