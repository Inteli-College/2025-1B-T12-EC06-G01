import os
import shutil
import random

# Caminho absoluto da raiz do projeto
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
RAW_DIR = os.path.join(ROOT_DIR, "2025-1B-T12-EC06-G01", "src", "machineLearning", "imagens_raw")
DATASET_DIR = os.path.join(ROOT_DIR, "src", "machineLearning", "dataset")
TEST_DIR = os.path.join(ROOT_DIR, "src", "machineLearning", "dataset", "test")

# Função de divisão
def split_images(image_list, train_ratio=0.7, val_ratio=0.2):
    total = len(image_list)
    random.shuffle(image_list)
    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)
    return image_list[:train_end], image_list[train_end:val_end], image_list[val_end:]

def real_split():
    # Criar diretórios de saída
    for split in ['train', 'val']:
        split_dir = os.path.join(DATASET_DIR, split)
        os.makedirs(split_dir, exist_ok=True)

    os.makedirs(TEST_DIR, exist_ok=True)


    # Percorrer tipos de fissuras
    for fissure_folder in os.listdir(RAW_DIR):
        fissure_path = os.path.join(RAW_DIR, fissure_folder)
        if not os.path.isdir(fissure_path):
            continue

        images = [f for f in os.listdir(fissure_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        train_imgs, val_imgs, test_imgs = split_images(images)

        # Criar subpastas para treino e validação
        train_subdir = os.path.join(DATASET_DIR, "train", fissure_folder)
        val_subdir = os.path.join(DATASET_DIR, "val", fissure_folder)
        os.makedirs(train_subdir, exist_ok=True)
        os.makedirs(val_subdir, exist_ok=True)

        # Copiar imagens
        for img in train_imgs:
            shutil.copy2(os.path.join(fissure_path, img), os.path.join(train_subdir, img))

        for img in val_imgs:
            shutil.copy2(os.path.join(fissure_path, img), os.path.join(val_subdir, img))

        for img in test_imgs:
            shutil.copy2(os.path.join(fissure_path, img), os.path.join(TEST_DIR, img))

    print("Divisão e organização das imagens concluída.")

real_split()