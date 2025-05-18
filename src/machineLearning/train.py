# from ultralytics import YOLO

# model = YOLO("yolo11n-cls.pt")

# model.train(
#     data="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset", 
#     epochs=50, 
#     imgsz=224,
#     patience=10) 

from ultralytics import YOLO

# Etapa 2: Carrega modelo pré-treinado
model = YOLO("yolo11s-cls.pt")

# Etapa 3: Treinamento com boas práticas
model.train(
    data="fissura_dataset", 
    epochs=50,
    imgsz=224,
    patience=5,
    plots=True
)
