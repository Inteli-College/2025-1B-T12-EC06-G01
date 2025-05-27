import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array, load_img, save_img
from pathlib import Path
import numpy as np
import time

# --- Configurações ---
BASE_INPUT_DIR = Path('fissura_dataset')  # Pasta base com subpastas train/ e val/
OUTPUT_DIR = Path('fissura_dataset_augmented') # Pasta de saída

NUM_AUGMENTATIONS_PER_TRAIN_IMAGE = 5  # Quantas versões aumentadas gerar para cada imagem DE TREINO
IMAGE_WIDTH = 320
IMAGE_HEIGHT = 320
TARGET_SIZE = (IMAGE_HEIGHT, IMAGE_WIDTH)
SEED = 42

tf.random.set_seed(SEED)
np.random.seed(SEED)

# --- Camadas de Data Augmentation (Keras Preprocessing Layers) ---
# Aplicadas SOMENTE às imagens de TREINO
data_augmentation_layers = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal", seed=SEED),
    tf.keras.layers.RandomRotation(0.1, fill_mode="nearest", seed=SEED),
    tf.keras.layers.RandomZoom(
        height_factor=(-0.1, 0.1),
        width_factor=(-0.1, 0.1),
        fill_mode="nearest",
        interpolation="bilinear",
        seed=SEED
    ),
    tf.keras.layers.RandomBrightness(factor=0.2, seed=SEED),
    tf.keras.layers.RandomContrast(factor=0.2, seed=SEED),
], name="data_augmentation")

def process_images_in_folder(
    input_folder: Path,
    output_folder: Path,
    target_size: tuple,
    is_training_set: bool,
    num_augmentations_per_image: int = 0
):
    if not input_folder.is_dir():
        print(f"    ERRO: Pasta de entrada não encontrada ou não é um diretório: {input_folder.resolve()}")
        return 0

    output_folder.mkdir(parents=True, exist_ok=True)
    print(f"    Processando pasta de entrada: {input_folder.resolve()}")
    print(f"    Salvando em pasta de saída: {output_folder.resolve()}")

    # Procurar por imagens com extensões comuns (considerando variações de maiúsculas/minúsculas)
    image_patterns = ['*.png', '*.PNG', '*.jpg', '*.JPG', '*.jpeg', '*.JPEG']
    image_files = []
    for pattern in image_patterns:
        image_files.extend(list(input_folder.glob(pattern)))

    if not image_files:
        print(f"    AVISO: Nenhuma imagem encontrada em {input_folder.resolve()} com os padrões {image_patterns}")
        return 0

    print(f"    Encontradas {len(image_files)} imagens. Exemplo: {image_files[0].name if image_files else 'N/A'}")
    processed_count = 0

    for img_path in image_files:
        original_img_name = img_path.stem
        img_extension = img_path.suffix # Mantém a extensão original

        try:
            # print(f"      Lendo imagem: {img_path.name}") # Descomente para debug detalhado
            img = load_img(img_path)
            img_array = img_to_array(img)
            img_resized_tf = tf.image.resize(img_array, target_size, method=tf.image.ResizeMethod.LANCZOS3)
            img_resized_to_save = tf.cast(img_resized_tf, tf.uint8).numpy()

            original_resized_filename = f"{original_img_name}_resized{img_extension}"
            save_img(output_folder / original_resized_filename, img_resized_to_save)
            processed_count +=1

            if is_training_set:
                for aug_idx in range(num_augmentations_per_image):
                    img_to_augment_batch = tf.expand_dims(img_resized_tf, 0)
                    augmented_batch = data_augmentation_layers(img_to_augment_batch, training=True)
                    augmented_img_array = tf.cast(tf.squeeze(augmented_batch, axis=0), tf.uint8).numpy()

                    augmented_filename = f"{original_img_name}_aug_{aug_idx+1}{img_extension}"
                    save_img(output_folder / augmented_filename, augmented_img_array)
                    processed_count += 1
        except Exception as e:
            print(f"    ERRO ao processar a imagem {img_path.name} em {input_folder.resolve()}: {e}")
    print(f"    Total de imagens salvas (originais redimensionadas + aumentadas) para esta pasta: {processed_count}")
    return processed_count

# ... (resto da função main e a chamada if __name__ == '__main__':) ...
# Certifique-se que a função main chama esta process_images_in_folder atualizada.
# A definição de BASE_INPUT_DIR e OUTPUT_DIR deve estar correta.
# Exemplo:
# BASE_INPUT_DIR = Path('fissura_dataset')
# OUTPUT_DIR = Path('fissura_dataset_augmented')

def main():
    if not BASE_INPUT_DIR.is_dir():
        print(f"ERRO: O diretório de entrada base '{BASE_INPUT_DIR}' não foi encontrado.")
        print("Ele deve conter subpastas 'train' e 'val', cada uma com subpastas de classe.")
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Pasta de saída principal: {OUTPUT_DIR.resolve()}")

    total_images_generated = 0
    start_time = time.time()

    # Iterar sobre 'train' e 'val'
    for split_name in ['train', 'val']:
        split_input_dir = BASE_INPUT_DIR / split_name
        split_output_dir = OUTPUT_DIR / split_name

        if not split_input_dir.is_dir():
            print(f"  Aviso: Pasta '{split_name}' não encontrada em {BASE_INPUT_DIR}. Pulando.")
            continue

        print(f"\nProcessando split: '{split_name}'")
        is_training_split = (split_name == 'train')

        class_subdirs = [d for d in split_input_dir.iterdir() if d.is_dir()]
        if not class_subdirs:
            print(f"  Nenhuma subpasta de classe encontrada em {split_input_dir}.")
            continue

        for class_dir in class_subdirs:
            class_name = class_dir.name
            print(f"  Processando classe: '{class_name}' no split '{split_name}'")

            current_class_input_folder = class_dir
            current_class_output_folder = split_output_dir / class_name

            num_augs = NUM_AUGMENTATIONS_PER_TRAIN_IMAGE if is_training_split else 0

            count = process_images_in_folder(
                input_folder=current_class_input_folder,
                output_folder=current_class_output_folder,
                target_size=TARGET_SIZE,
                is_training_set=is_training_split,
                num_augmentations_per_image=num_augs
            )
            total_images_generated += count
            print(f"    Imagens salvas para '{class_name}' ({split_name}): {count}")


    end_time = time.time()
    print(f"\n--- Processo de Augmentation Concluído ---")
    print(f"Tempo total de execução: {end_time - start_time:.2f} segundos.")
    print(f"Total de imagens processadas/geradas e salvas: {total_images_generated}")
    print(f"Estrutura de saída em: {OUTPUT_DIR.resolve()}")
    print("\nLembretes:")
    print("1. Imagens do conjunto 'train' foram aumentadas e as originais redimensionadas também foram salvas.")
    print("2. Imagens do conjunto 'val' foram APENAS redimensionadas e salvas (sem aumento aleatório).")
    print("3. Você pode agora usar a pasta '{OUTPUT_DIR.name}' como o 'data' para o treinamento do seu modelo YOLO.")

if __name__ == '__main__':
    main()