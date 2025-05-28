from ultralytics import YOLO

model = YOLO("yolo11s-cls.pt")

model.train(
    data="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset", 
    epochs=50, 
    imgsz=640,
    patience=7,
    batch=8,        
    dropout=0.3,
    weight_decay=0.001,
    cos_lr=True,
    augment=True, 
    multi_scale=True,
    plots=True,
    ) 


