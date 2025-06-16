from ultralytics import YOLO
from pathlib import Path
from datetime import datetime
from threading import Thread
import time, sys, os, csv

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
