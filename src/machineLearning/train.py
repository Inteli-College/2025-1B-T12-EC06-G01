from ultralytics import YOLO
from pathlib import Path
from datetime import datetime
from threading import Thread
import time, sys, os, csv
import argparse
import sys

BASE = Path(__file__).parent
print("BASE FILE: ",BASE)

def import_ws():
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from server.main import get_app
    from server.app.websocket import send_message
    from server.app.Utils.DiretoryUtil import DiretoryUtil
    util = DiretoryUtil(root_dir=str(BASE))
    current_app = get_app()
    return util, current_app, send_message

# 1) BASE → pasta deste script (machineLearning/)
def train_classify():
    # 2) dataset relativo
    dataset = BASE / "dataset" # Alterado para "dataset" conforme o HEAD
    if not dataset.exists():
        raise FileNotFoundError(f"Dataset não encontrado em: {dataset}")

def train_model(socketio):
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
    nome_treino = f"train_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    log_path = runs_dir / nome_treino / "results.csv"
    
    socketio.start_background_task(monitorar_epochs, log_path, 50)

    model = YOLO("yolo11n-cls.pt")

    # 5) treina usando caminhos relativos e o arquivo de configuração
    model.train(
        data=str(dataset),             # Caminho relativo para o dataset
        model="yolo11n-cls.pt",        
        epochs=50,                     
        imgsz=224,                     
        project=str(runs_dir),        
        name=nome_treino,                  
        cfg=str(config_file)         
    )

def monitorar_epochs(log_path, total_epochs):
    util, current_app, send_message = import_ws()
    last_epoch_reported = -1
    i = 0

    while True:
        print("\nESTOU RODANDO!!\n")
        if not log_path.exists():
            time.sleep(1)
            continue

        with log_path.open(newline='') as csvfile:
            reader = csv.reader(csvfile)
            lines = list(reader)

            if len(lines) > 1:
                current_epoch = len(lines) - 1

                if current_epoch != last_epoch_reported:
                    progress = int((current_epoch / total_epochs) * 100)
                    send_message(progress, 'training_progress_fe')
                    last_epoch_reported = current_epoch
                    i = 0
                
                else:
                    i += 1
                    if i == 15:   
                        with current_app.app_context():               
                            send_message(100, 'training_progress_fe')
                            util.get_train_version()
                            break

        if current_epoch >= total_epochs:           
            break

        time.sleep(1)


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

