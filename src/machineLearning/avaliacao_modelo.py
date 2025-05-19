from ultralytics import YOLO

model = YOLO("/runs/classify/train11/weights/best.pt")
metrics = model.val()

print(f"Acurácia top-1: {metrics.top1:.3f}")