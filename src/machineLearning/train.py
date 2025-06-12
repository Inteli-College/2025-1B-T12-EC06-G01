from ultralytics import YOLO
from pathlib import Path

BASE = Path(__file__).parent

# 1) BASE → pasta deste script (machineLearning/)

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
