import os

path = "fissura_dataset/train"
for classe in os.listdir(path):
    num_imgs = len(os.listdir(os.path.join(path, classe)))
    print(f"{classe}: {num_imgs} imagens")

print("\nValidação:")
path_val = "fissura_dataset/val"
for classe in os.listdir(path_val):
    num_imgs = len(os.listdir(os.path.join(path_val, classe)))
    print(f"{classe}: {num_imgs} imagens")