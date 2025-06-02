import os
import random
import shutil

# Caminho da pasta com imagens por classe
origem = r"C:/Users/pietr/Documents/modulo6/fissuras_originais"

# Novo caminho para salvar o dataset organizado
destino = r"C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/dataset"

# Proporções de divisão
train_ratio = 0.7
val_ratio = 0.2
test_ratio = 0.1

# Cria a pasta 
def cria_pasta(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Criar estrutura de saída
for subset in ['train', 'val', 'test']:
    for class_name in os.listdir(origem):
        class_dir = os.path.join(destino, subset, class_name)
        cria_pasta(class_dir)

# Fazer o split e copiar as imagens
for class_name in os.listdir(origem):
    class_path = os.path.join(origem, class_name)
    imagens = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.PNG'))]
    random.shuffle(imagens)

    n_total = len(imagens)
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)

    train_imgs = imagens[:n_train]
    val_imgs = imagens[n_train:n_train + n_val]
    test_imgs = imagens[n_train + n_val:]

    for img in train_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'train', class_name, img)
        shutil.copy(origem_path, destino_path)

    for img in val_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'val', class_name, img)
        shutil.copy(origem_path, destino_path)

    for img in test_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'test', class_name, img)
        shutil.copy(origem_path, destino_path)

print("Imagens organizadas em 'dataset/train', 'val' e 'test' no formato YOLO.")
