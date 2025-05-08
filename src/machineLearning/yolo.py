from ultralytics import YOLO

# Carrega o modelo YOLOv8 
model = YOLO("yolov8n.pt")

# Roda a predição na imagem teste (spoiler: funcionou, mas não detectou nada pq o modelo não reconhce fissuras ainda. por isso, precisamos treinar ele pra isso.)
results = model.predict(source="FR1.png", show=True)