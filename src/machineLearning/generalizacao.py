#!/usr/bin/env python3
from ultralytics import YOLO
from pathlib import Path
import argparse, sys, os

def main():
    # 1) Base do script
    BASE_DIR = Path(__file__).parent

    # 2) Args: --test_folder opcional
    p = argparse.ArgumentParser(description="Classifica fissuras em imagens")
    p.add_argument(
        "--test_folder",
        type=Path,
        default=BASE_DIR / "test_images",
        help="Pasta com imagens .jpg/.png para inferir"
    )
    args = p.parse_args()

    test_folder = args.test_folder

    # 3) Encontra o best.pt
    runs_cls = BASE_DIR / "runs" / "classify"
    candidates = list(runs_cls.glob("*/weights/best.pt"))
    if not candidates:
        print(f"Erro: nenhum best.pt em {runs_cls}", file=sys.stderr)
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
        sys.exit(0)

    # 6) Percorre imagens e infere
    for file in os.listdir(test_folder):
        if file.lower().endswith((".jpg", ".png")):
            img_path = test_folder / file
            results = model.predict(source=str(img_path))
            probs   = results[0].probs
            cls_id  = int(probs.top1)
            conf    = float(probs.top1conf)
            cls_name= model.names[cls_id]
            print(f"{file} → {cls_name} ({conf:.2f} conf.)")

if __name__ == "__main__":
    main()
