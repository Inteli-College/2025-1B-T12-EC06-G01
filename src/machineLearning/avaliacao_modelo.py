from ultralytics import YOLO

# model = YOLO("C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/melhores_modelos/best19.pt")
# Caminho para o modelo treinado
model = YOLO(r"C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/melhores_modelos/best21.pt")

# Avaliação no conjunto de teste
model.val(data=r"C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/dataset", imgsz=224)



# metrics = model.val()
# print(metrics.class_result)
# print(f"Acurácia top-1: {metrics.top1:.3f}")