
---
title: Modelo de Detecção com YOLOv8n
---

## 1. Introdução

Nesta etapa do projeto, foi implementado um modelo de **detecção de fissuras** em imagens de estruturas de concreto utilizando o `YOLOv8n`, uma das versões mais leves e eficientes da família YOLO (*You Only Look Once*), desenvolvida pela Ultralytics.

Diferente da classificação, onde o modelo apenas identifica a **categoria da imagem**, a detecção permite **localizar com precisão as regiões da imagem onde as fissuras ocorrem**, desenhando um *bounding box* ao redor da área de interesse.

O modelo YOLOv8n foi escolhido por oferecer **boa acurácia com baixo custo computacional**, ideal para cenários com restrições de hardware e tempo de desenvolvimento.

---

## 2. Atualizações do Modelo e Processo

Esta seção detalha as **modificações e aprimoramentos** realizados no pipeline de detecção de fissuras utilizando o modelo `YOLOv8n`. O objetivo principal foi garantir uma **estrutura de execução robusta**, com validações de diretórios e caminhos relativos, para aumentar a **portabilidade** e facilitar a **integração contínua**.

### 2.1. Novo Pipeline de Treinamento com Verificações

O pipeline de treinamento `train_detect()` foi desenvolvido com foco em **confiabilidade e reprodutibilidade**, incorporando verificações de estrutura e o uso da biblioteca `pathlib`.

```python
def train_detect():
    # Caminho para data.yaml
    data_yaml = BASE / "data_detect.yaml"
    if not data_yaml.exists():
        raise FileNotFoundError(f"Arquivo data_detect.yaml não encontrado em: {data_yaml}")
    
    # Verifica se estrutura de dataset está correta
    detect_root = BASE / "dataset_deteccao"
    if not (detect_root / "images" / "train").exists() or not (detect_root / "labels" / "train").exists():
        raise FileNotFoundError("Estrutura de pastas de detecção incorreta. Veja data_detect.yaml e dataset_deteccao/")

    # Diretório de saída
    runs_dir = BASE / "runs" / "detect"
    runs_dir.mkdir(parents=True, exist_ok=True)

    # Carrega modelo base (YOLOv8n)
    model = YOLO("yolov8n.pt")

    # Treinamento com hiperparâmetros ajustados
    model.train(
        data=str(data_yaml),
        epochs=50,
        imgsz=224,
        batch=8,
        lr0=0.001,
        weight_decay=0.001,
        patience=10,
        label_smoothing=0.1,
        cos_lr=True,
        multi_scale=True,
        project=str(runs_dir),
        name="train"
    )
```

As principais melhorias incluem:

- **Verificação automática da estrutura esperada de pastas** (`images/train` e `labels/train`);
- **Hiperparâmetros ajustados** com foco em generalização e estabilidade do modelo.

## 3. Estrutura Esperada do Dataset

Para o correto funcionamento do pipeline, é necessário que o dataset siga a seguinte estrutura dentro da pasta `dataset_deteccao/`:

```
dataset_deteccao/
├── images/
│   ├── train/
│   └── val/
├── labels/
│   ├── train/
│   └── val/
```

Cada imagem `.jpg` ou `.png` deve possuir um rótulo correspondente `.txt` com as anotações em formato YOLO.

O arquivo `data_detect.yaml` deve estar localizado na mesma pasta do script e conter as referências relativas para as imagens e classes.

## 4. Parâmetros do Treinamento

A escolha dos hiperparâmetros do modelo YOLOv8n considerou a natureza do problema e a quantidade limitada de dados disponíveis:

| Parâmetro         | Valor      | Justificativa                                  |
|-------------------|------------|------------------------------------------------|
| `imgsz`           | 224        | Reduz o custo computacional sem perder contexto |
| `batch`           | 8          | Ajustado para compatibilidade com CPUs         |
| `patience`        | 10         | Evita overfitting em poucos ciclos             |
| `lr0`             | 0.001      | Taxa de aprendizado inicial moderada           |
| `weight_decay`    | 0.001      | Regularização leve para generalização          |
| `label_smoothing` | 0.1        | Reduz confiança excessiva do modelo            |
| `cos_lr`          | True       | Scheduler cíclico que melhora estabilidade     |
| `multi_scale`     | True       | Varia o tamanho das imagens dinamicamente      |

## 5. Próximos Passos

Os próximos ciclos de melhoria devem focar em:

- **Análise das métricas obtidas nos dados de validação**, como *mAP*, *precisão* e *recall*;
- **Avaliar o impacto da posição dos labels nas imagens durante a anotação**, com aplicações como LabelImg, Supervisely e Label Studio;
- **Aprimorar o dataset com mais exemplos de diferentes tipos de fissuras**, especialmente em ambientes variados;
- **Implementar script automático de inferência e avaliação**, similar ao `generalizacao.py` do modelo de classificação;
- **Comparar o YOLOv8n com outras variantes (YOLOv8s, YOLOv5s)** em termos de acurácia e velocidade.

Devido ao foco no retreinamento, o modelo de detecção não foi integrado ao modelo de classificação nesta sprint. Assim, o principal objetivo futuro será **integrar ambos os modelos** em um pipeline unificado, que permita detecção e classificação em sequência.

## 6. Considerações Finais

O modelo de detecção com YOLOv8n foi configurado com foco em **reprodutibilidade, estabilidade e portabilidade**. A combinação de boas práticas de organização com hiperparâmetros bem ajustados proporciona um ponto de partida sólido para futuros testes de generalização e integração com o modelo de classificação.
