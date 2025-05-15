from ultralytics import YOLO

model = YOLO("yolo11n-cls.pt")

model.train(data="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset", epochs=50, imgsz=224)

