import cv2
import numpy as np
import os
import random

# Caminho para a pasta de fissuras de retração
input_folder = "C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset/train/fissura_retracao"

# Percorre todas as imagens da pasta
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        img_path = os.path.join(input_folder, filename)
        img = cv2.imread(img_path)

        # Escolhe aleatoriamente a transformação
        transform = random.choice(['rotate', 'bright'])

        if transform == 'rotate':
            transformed = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
            suffix = "_rotated"
        else:
            factor = random.uniform(0.6, 1.4)
            transformed = cv2.convertScaleAbs(img, alpha=factor, beta=0)
            suffix = "_bright"

        # Cria o novo nome do arquivo
        new_filename = filename.split('.')[0] + f"{suffix}.png"
        cv2.imwrite(os.path.join(input_folder, new_filename), transformed)

print("Aumentação concluída com 1 transformação por imagem (rotação 90° ou brilho aleatório).")
