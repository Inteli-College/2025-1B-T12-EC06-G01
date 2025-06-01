---
title: Modelo de Classificação Yolo
---

## 1. Atualizações do Modelo e Processo

Esta seção detalha as **atualizações e aprimoramentos** realizados no modelo de classificação `YOLOv11n-cls` e no pipeline de treinamento e avaliação durante a sprint atual. O foco principal foi otimizar a **portabilidade** do código e a **robustez** do modelo.


### 1.1. Refatoração para Caminhos Relativos

Uma mudança significativa foi a refatoração dos scripts de treinamento e avaliação para utilizar **caminhos relativos** ao invés de caminhos absolutos. **Isso garante que o projeto possa ser executado em diferentes ambientes** sem a necessidade de modificações manuais nos diretórios.

#### Código Anterior (Exemplo `train.py`):

```python
from ultralytics import YOLO

model = YOLO("yolo11n-cls.pt")

model.train(
    data="/src/machineLearning/fissura_dataset", 
    epochs=50, 
    imgsz=224,
    patience=5,
    plots=True,
    ) 
```

Código Atualizado (train.py):

```python
from ultralytics import YOLO
from pathlib import Path

# 1) BASE → pasta deste script (machineLearning/)
BASE = Path(__file__).parent
# 2) dataset relativo
dataset_nome = "fissura_dataset" 
dataset = BASE / dataset_nome

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
```

A alteração no train.py agora utiliza o módulo **pathlib** para criar caminhos dinamicamente a partir do diretório base do script. Isso significa que o dataset e os resultados do treinamento **são referenciados de forma relativa**, tornando o projeto mais flexível a mudanças no ambiente de desenvolvimento.

## 1.2. Localização Dinâmica do Modelo para Avaliação
O script de avaliação (avaliacao.py) foi aprimorado para localizar automaticamente o modelo treinado mais recente (best.pt) dentro do diretório de runs. Isso elimina a necessidade de atualizar manualmente o caminho do modelo após cada treinamento, garantindo que a avaliação sempre utilize a versão mais otimizada.

Código Anterior (avaliacao.py):

```python
from ultralytics import YOLO

model = YOLO("/runs/classify/train11/weights/best.pt")
metrics = model.val()

print(f"Acurácia top-1: {metrics.top1:.3f}")
```

Código Atualizado (avaliacao.py):

```python
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
Este ajuste melhora a automação do pipeline de avaliação, facilitando o fluxo de trabalho de desenvolvimento contínuo.
```

## 1.3. Atualização do Script de Generalização (generalizacao.py)
O script de generalização foi completamente refatorado para aumentar sua robustez e usabilidade. Agora, ele aceita um argumento de linha de comando para especificar a pasta de imagens de teste e cria a pasta de teste caso ela não exista. Além disso, o script localiza o modelo best.pt de forma dinâmica, similar ao script de avaliação.

Código Anterior (generalizacao.py):

```python
from ultralytics import YOLO
import os

model = YOLO("/runs/classify/train11/weights/best.pt")

test_folder = "C:/Users/pietr/Documents/modulo6/generalizacao"

print(model.names)

# Faz a previsão para cada imagem
for file in os.listdir(test_folder):
    if file.endswith(".jpg") or file.endswith(".PNG"):
        path = os.path.join(test_folder, file)
        results = model.predict(path)
        probs = results[0].probs
        classe_prevista = probs.top1
        confianca = probs.top1conf
        print(f"{file} → Classe prevista: {classe_prevista} ({confianca:.2f} de confiança)")
```

Código Atualizado (generalizacao.py):

```python
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
```

As principais melhorias incluem:

- Argumento de Linha de Comando: Permite especificar a pasta de teste com --test_folder.
- Criação de Pasta de Teste: Se a pasta de teste não existir, ela é criada automaticamente, com uma mensagem instruindo o usuário a adicionar imagens.
- Localização Dinâmica do Modelo: O modelo mais recente é encontrado e carregado automaticamente, similar ao avaliacao.py.

## 1.4. Desenvolvimento de código para separar o dataset
Nessa sprint, também foi desenvolvido o códiog abaixo, que tem como objetivo separar o dataset em conjuntos de treino, validação e teste, de forma automática

```python
import os
import random
import shutil
# Caminho da pasta com imagens por classe
origem = r"C:/Users/pietr/Documents/modulo6/fissuras_originais" # (Ainda precisa ser refatorado com o pathlib)
# Novo caminho para salvar o dataset organizado
destino = r"C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/dataset" # (Ainda precisa ser refatorado com o pathlib)
# Proporções de divisão
train_ratio = 0.7
val_ratio = 0.2
test_ratio = 0.1
# Cria a pasta se não existir
def cria_pasta(path):
    if not os.path.exists(path):
        os.makedirs(path)
# Criar estrutura de saída
for subset in ['train', 'val', 'test']:
    for class_name in os.listdir(origem):
        class_dir = os.path.join(destino, subset, class_name)
        cria_pasta(class_dir)
# Fazer o split e copiar as imagens
for class_name in os.listdir(origem):
    class_path = os.path.join(origem, class_name)
    imagens = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.PNG'))]
    random.shuffle(imagens)
    n_total = len(imagens)
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)
    train_imgs = imagens[:n_train]
    val_imgs = imagens[n_train:n_train + n_val]
    test_imgs = imagens[n_train + n_val:]
    for img in train_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'train', class_name, img)
        shutil.copy(origem_path, destino_path)
    for img in val_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'val', class_name, img)
        shutil.copy(origem_path, destino_path)
    for img in test_imgs:
        origem_path = os.path.join(class_path, img)
        destino_path = os.path.join(destino, 'test', class_name, img)
        shutil.copy(origem_path, destino_path)
print(":marca_de_verificação_branca: Imagens organizadas em 'dataset/train', 'val' e 'test' no formato YOLO.")
```
## 2. Próximos Passos 
Mantemos o foco nos próximos passos já delineados para aprimorar a robustez e a capacidade de generalização do modelo:

- Aumentar o dataset com novas imagens, em diferentes condições;
- Aplicar data augmentation mais agressiva;
- Inserir distrações (fundos aleatórios) para validar o foco do modelo;
- Comparar com outros modelos para verificar qual modelo se alinha melhor ao objetivo desse projeto.


:::tip
As atualizações desta sprint visam principalmente aprimorar a manutenibilidade, a portabilidade do código e o ajuste ao overtift observado. As próximas etapas continuarão a focar na validação prática e na expansão do dataset para mitigar o risco de overfitting e garantir que o modelo performe de forma robusta em cenários reais.
:::

---
## Insights sobre o Modelo e seu Desempenho

### Visão Geral 

O modelo de classificação treinado com o `YOLO11n-cls` utilizando imagens fornecidas pelo IPT apresentou excelente desempenho em termos de acurácia e consistência. Durante a avaliação nas imagens do conjunto de teste (dividido originalmente a partir do próprio dataset vindo do IPT), as principais observações incluem:

- Alta acurácia nas imagens reais do IPT;
- Predições corretas para *fissuras de retração* e *fissuras térmicas*;
- Matriz de confusão sem registros de erro;
- Classificações precisas desde que as imagens estejam dentro do padrão visual aprendido.

### Qualidade das Imagens e Padrão Visual

Em conversa com o parceiro do projeto, foi confirmado que todas as imagens que chegam à aplicação seguem o mesmo padrão visual do dataset de treinamento. Isso reforça que:

- O modelo está sendo exposto a dados consistentes com a realidade da operação;
- A generalização externa não é uma preocupação imediata;
- A utilização de imagens geradas por IA foi descartada, por não refletirem fielmente o cenário real.

### Avaliação de Desempenho

A avaliação foi conduzida em dois contextos:

**1. Conjunto de teste real (oferecido pelo IPT)**
    - **100% de acurácia**, com todas as imagens corretamente classificadas;
    - A matriz confusão revelou **nenhum falso positivo ou falso negativo**;
    - Métricas de precisão, recall e F1-score foram perfeitas para ambas as classes.

**2. Imagens externas ou modificadas**
    - O modelo demostrou uma queda de desempenho, principalmente para as fissuras térmicas;
    - Isso pode indicar que o modelo pode estar mais sensível a padrões de retração e com menor generalização para as térmicas em contextos não vistos durante o treino.

### Limites de Generalização

Embora seja preciso em seu domínio de treinamento, o modelo demonstrou baixa generalização para imagens vindas de outras origens (ex: resoluções variadas, IA, google e artigos). Essa limitação é comum em modelos de visão computacional treinados com datasets homogêneos.

- O modelo é robusto e confiável desde que as entradas estejam dentro do padrão visual aprendido;
- Casos externos exigem cuidado e análises mais profundas.

### Estratégia para Evolução Contínua

A principal conclusão estratégica foi:

- Não será utilizado aumento do dataset com imagens geradas por IA, dado o risco de criar padrões artificiais que não se repetem na prática;
- A prioridade será desenvolver rotas e mecanismos de retreinamento contínuo, permitindo que o modelo seja atualizado à medida que novos projetos gerarem mais imagens reais;
- Garantir que o modelo se adapte a variações graduais no padrão visual real com o tempo.

### Conclusão

- O desempenho do modelo atual é altamente eficaz no domínio específico do IPT;
- Possui limitações de generalização, mas está controlado;
- A infraestrutura de revalidação periódica e retreinamento é fundamental para garantir a longevidade e adaptabilidade do sistema de classificação;
