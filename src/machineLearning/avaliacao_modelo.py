from ultralytics import YOLO
from pathlib import Path

BASE = Path(__file__).parent # Define o diretório base do script

# Define o caminho para a pasta de melhores modelos
best_models_dir = BASE / "melhores_modelos"
# Define o caminho completo para o modelo específico que você quer carregar
model_path = best_models_dir / "best21.pt"

if not model_path.exists():
    raise FileNotFoundError(f"O modelo '{model_path.name}' não foi encontrado em: {best_models_dir}. Verifique o caminho e o nome do arquivo.")

print(f"Usando modelo específico: {model_path}")
model = YOLO(str(model_path))

# Caminho relativo para o dataset, que será usado para a avaliação
dataset_path = BASE / "dataset"
if not dataset_path.exists():
    raise FileNotFoundError(f"Dataset de validação não encontrado em: {dataset_path}. Por favor, verifique o caminho.")

# Avaliação no conjunto de validação/teste, usando o caminho relativo do dataset e imgsz
metrics = model.val(data=str(dataset_path), imgsz=224)

print(f"Acurácia top-1: {metrics.top1:.3f}")