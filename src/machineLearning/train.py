from ultralytics import YOLO

model = YOLO("yolo11n-cls.pt")

model.train(
    data="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/dataset", 
    cfg="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/meu_config.yaml",
    ) 


