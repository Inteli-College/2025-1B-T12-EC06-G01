from ultralytics import YOLO
from pathlib import Path

BASE     = Path(__file__).parent

# 1) BASE → pasta deste script (machineLearning/)
BASE     = Path(__file__).parent
# 2) dataset relativo
dataset  = BASE / "fissura_dataset"
if not dataset.exists():
    raise FileNotFoundError(f"Dataset não encontrado em: {dataset}")

# 3) onde salvar os runs
runs_dir = BASE / "runs" / "classify"
runs_dir.mkdir(parents=True, exist_ok=True)


model = YOLO("yolo11n-cls.pt")

# 5) treina usando caminhos relativos
model.train(
    data=str(dataset),             # agora ./machineLearning/fissura_dataset
    model="yolo11n-cls.pt",        # ou outra checkpoint/base
    epochs=50,
    imgsz=224,
    project=str(runs_dir),         # vai gerar machineLearning/runs/classify/train/…
    name="train"
)

