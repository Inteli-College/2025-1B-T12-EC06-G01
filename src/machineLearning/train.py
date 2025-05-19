from ultralytics import YOLO

model = YOLO("yolo11n-cls.pt")

model.train(
    data="/src/machineLearning/fissura_dataset", 
    epochs=50, 
    imgsz=224,
    patience=5,
    plots=True,
    ) 


