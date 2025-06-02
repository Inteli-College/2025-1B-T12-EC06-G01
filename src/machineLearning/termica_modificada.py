import cv2
import numpy as np
import os
import random

# Caminho da pasta com as imagens originais
input_folder = "C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset/train/fissura_termica"

# Deletar imagens geradas anteriormente (com sufixos)
for filename in os.listdir(input_folder):
    if "_rotated" in filename or "_bright" in filename:
        os.remove(os.path.join(input_folder, filename))

# Aplica uma nova modificação por imagem
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")) and "_rotated" not in filename and "_bright" not in filename:
        img_path = os.path.join(input_folder, filename)
        img = cv2.imread(img_path)

        transform = random.choice(['rotate', 'bright'])

        if transform == 'rotate':
            # Rotação de 90 graus (sem fundo preto)
            rotated = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
            transformed = rotated
            suffix = "_rotated"
        else:
            # Modifica brilho
            factor = random.uniform(0.6, 1.4)
            transformed = cv2.convertScaleAbs(img, alpha=factor, beta=0)
            suffix = "_bright"

        new_filename = filename.split('.')[0] + f"{suffix}.png"
        cv2.imwrite(os.path.join(input_folder, new_filename), transformed)

print("Imagens antigas deletadas e novas imagens geradas com uma modificação cada.")
