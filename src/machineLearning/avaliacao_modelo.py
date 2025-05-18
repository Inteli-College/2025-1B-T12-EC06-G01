from ultralytics import YOLO

# Etapa 4: Avaliação
model = YOLO("C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/runs/classify/train5/weights/best.pt")
metrics = model.val()

print(f"Acurácia top-1: {metrics.top1:.3f}")