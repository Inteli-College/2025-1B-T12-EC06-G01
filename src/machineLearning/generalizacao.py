from ultralytics import YOLO
from pathlib import Path
import argparse, sys, os

def main():
    # 1) Base do script
    BASE_DIR = Path(__file__).parent

    p = argparse.ArgumentParser(description="Classifica fissuras em imagens")
    p.add_argument(
        "--test_folder",
        type=Path,
        default=BASE_DIR / "test_images",
        help="Pasta com imagens .jpg/.png para inferir"
    )
    p.add_argument(
        "--model_path",
        type=Path,
        default=None, # Define como None para buscar dinamicamente por padrão
        help="Caminho relativo para o arquivo .pt do modelo (ex: melhores_modelos/best21.pt)"
    )
    args = p.parse_args()

    test_folder = args.test_folder
    model_to_load = args.model_path

    # 3) Encontra ou carrega o best.pt
    if model_to_load:
        # Se um caminho de modelo foi fornecido, usa-o (assumindo que seja relativo à BASE_DIR)
        model_path = BASE_DIR / model_to_load
        if not model_path.exists():
            print(f"Erro: Modelo não encontrado em {model_path}", file=sys.stderr)
            sys.exit(1)
    else:
        # Caso contrário, busca o best.pt mais recente, como no "develop"
        runs_cls = BASE_DIR / "runs" / "classify"
        candidates = list(runs_cls.glob("*/weights/best.pt"))
        if not candidates:
            print(f"Erro: nenhum best.pt encontrado em {runs_cls}. Tente especificar com --model_path.", file=sys.stderr)
            sys.exit(1)
        model_path = sorted(candidates, key=lambda p: p.stat().st_mtime)[-1]
    
    print(f"Usando modelo em: {model_path}")

    # 4) Carrega modelo
    model = YOLO(str(model_path))
    print(f"Classes: {model.names}")

    # 5) Prepara test_folder
    if not test_folder.exists():
        print(f"Pasta não existe, criando: {test_folder}")
        test_folder.mkdir(parents=True)
        print("Coloque suas imagens (.jpg/.png) nessa pasta e execute novamente.")
        sys.exit(0) # Sai após criar a pasta para o usuário adicionar imagens

    # 6) Percorre imagens e infere
    for file in os.listdir(test_folder):
        # Converte para minúsculas para aceitar .JPG, .PNG, etc.
        if file.lower().endswith((".jpg", ".png", ".webp")): # Adicionado .webp do HEAD
            img_path = test_folder / file
            results = model.predict(source=str(img_path))
            probs   = results[0].probs
            cls_id  = int(probs.top1)
            conf    = float(probs.top1conf)
            cls_name= model.names[cls_id]
            print(f"{file} → {cls_name} ({conf:.2f} conf.)")

if __name__ == "__main__":
    main()