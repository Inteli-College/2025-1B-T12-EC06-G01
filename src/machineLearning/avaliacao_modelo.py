from ultralytics import YOLO
from pathlib import Path

BASE = Path(__file__).parent
runs_cls = BASE / "runs" / "classify"

# Procura por qualquer pasta */weights/best.pt
candidates = list(runs_cls.glob("*/weights/best.pt"))
if not candidates:
    raise FileNotFoundError(f"Nenhum best.pt encontrado em {runs_cls}")
# Pega o mais recente (opcional)
model_path = sorted(candidates, key=lambda p: p.stat().st_mtime)[-1]

print(f"Usando checkpoint: {model_path}")
model = YOLO(str(model_path))

metrics = model.val()
print(f"Acurácia top-1: {metrics.top1:.3f}")
