import os
from ultralytics import YOLO
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
from torchvision import transforms
import torch
import numpy as np

# Caminhos
model_path = "melhores_modelos/best21.pt"
test_dir = "dataset/test"

# Labels (ordem deve bater com a usada no treinamento)
class_names = sorted(os.listdir(test_dir))  # ['fissura_retracao', 'fissura_termica']

# Carrega modelo
model = YOLO(model_path)

# Transforma a imagem
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Coletar imagens e labels reais
true_labels = []
pred_labels = []

for class_index, class_name in enumerate(class_names):
    folder = os.path.join(test_dir, class_name)
    for img_name in os.listdir(folder):
        img_path = os.path.join(folder, img_name)
        image = Image.open(img_path).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)

        # Predição
        with torch.no_grad():
            result = model(input_tensor, verbose=False)[0]
            pred_index = int(result.probs.top1)

        true_labels.append(class_index)
        pred_labels.append(pred_index)

# Métricas
print("\nCLASSIFICATION REPORT:")
print(classification_report(true_labels, pred_labels, target_names=class_names))

# Matriz de confusão
conf_matrix = confusion_matrix(true_labels, pred_labels)

plt.figure(figsize=(6, 5))
sns.heatmap(conf_matrix, annot=True, fmt="d", xticklabels=class_names, yticklabels=class_names, cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()
