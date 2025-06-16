from ultralytics import YOLO
from pathlib import Path
import argparse
import sys

BASE = Path(__file__).parent

# 1) BASE → pasta deste script (machineLearning/)
def train_classify():
    # 2) dataset relativo
    dataset = BASE / "dataset" # Alterado para "dataset" conforme o HEAD
    if not dataset.exists():
        raise FileNotFoundError(f"Dataset não encontrado em: {dataset}")

def train_model():
    # 2) dataset relativo
    dataset = BASE / "dataset" # Alterado para "dataset" conforme o HEAD
    if not dataset.exists():
        raise FileNotFoundError(f"Dataset não encontrado em: {dataset}")
    # O caminho para o arquivo de configuração, tornando-o relativo
    config_file = BASE / "meu_config.yaml"
    if not config_file.exists():
        raise FileNotFoundError(f"Arquivo de configuração não encontrado em: {config_file}")

    # 3) onde salvar os runs
    runs_dir = BASE / "runs" / "classify"
    runs_dir.mkdir(parents=True, exist_ok=True)

    model = YOLO("yolo11n-cls.pt")

    # 5) treina usando caminhos relativos e o arquivo de configuração
    model.train(
        data=str(dataset),             # Caminho relativo para o dataset
        model="yolo11n-cls.pt",        
        epochs=50,                     
        imgsz=224,                     
        project=str(runs_dir),        
        name="train",                  
        cfg=str(config_file)           
    )

def train_detect():
     # → Pipeline novo de detecção
    data_yaml = BASE / "data_detect.yaml"
    if not data_yaml.exists():
        raise FileNotFoundError(f"Arquivo data_detect.yaml não encontrado em: {data_yaml}")
    # garante que a pasta de images/labels existe
    detect_root = BASE / "dataset_deteccao"
    if not (detect_root / "images" / "train").exists() or not (detect_root / "labels" / "train").exists():
        raise FileNotFoundError("Estrutura de pastas de detecção incorreta. Veja data_detect.yaml e datasets_detect/")

    runs_dir = BASE / "runs" / "detect"
    runs_dir.mkdir(parents=True, exist_ok=True)

    # Modelo de detecção (YOLOv8n)
    model = YOLO("yolov8n.pt")
    model.train(
        data=str(data_yaml),  # YAML de detecção
        model="yolov8n.pt",
        epochs=50,            # pode manter 50 ou ajustar
        imgsz=640,            # recomenda-se 640 para detecção; ajuste conforme necessidade
        project=str(runs_dir),
        name="train"
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Treinar modelo de fissura (classify ou detect)")
    parser.add_argument(
        "--task",
        choices=["classify", "detect"],
        default="classify",
        help="Escolha 'classify' para classificação ou 'detect' para detecção"
    )
    args = parser.parse_args()

    if args.task == "classify":
        print("=== Iniciando treinamento de CLASSIFICAÇÃO ===")
        train_classify()
    else:
        print("=== Iniciando treinamento de DETECÇÃO ===")
        train_detect()

