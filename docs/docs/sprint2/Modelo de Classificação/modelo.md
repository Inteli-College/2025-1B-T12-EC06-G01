---
title: Modelo de Classificação
---

## 1. Introdução

Essa seção apresenta o modelo de aprendizado de máquina utilizado para classificar imagens de fissuras em estruturas de concreto em duas categorias distintas: **fissuras térmicas** e **fissuras de retração**. 

O objetivo nesta fase do projeto foi testar diferentes modelos e selecionar aquele que melhor se encaixa nas necessidades do cliente, com foco em precisão na classificação. Vale ressaltar que o projeto ainda está em fase inicial, e o modelo continuará sendo aprimorado nas próximas sprints.

## 2. Escolha do Modelo:

O modelo utilizado nessa sprint foi o YOLO11, mais especificamente o `YOLO11n-cls`. O YOLO (*You Only Look Once*) é uma família de modelos de deep learning utilizado para detecção de objetos em imagens e vídeos. 

A escolha por esse modelo se deu por ele ser conhecido pela sua alta acurácia e rapidez, características fundamentais para o contexto deste projeto, que possui tempo de desenvolvimento limitado (10 semanas) e exige alta acurácia na classificação.

As versões mais recentes do YOLO são desenvolvidas pela empresa Ultralytics, que oferece modelos prontos para uso e ferramentas para treinamento customizado com dados próprios. As principais tarefas de visão computacional capazes de serem realizadas com o YOLO são detecção, classificação e segmentação. 

Os modelos de classificação do YOLO são pré-treinados com **ImageNet**, um extenso dataset com milhões de imagens rotuladas utilizado para o treinamento de modelos que envolvem visão computacional e deep learning. Ou seja, o modelo já aprendeu a reconhecer padrões visuais genéricos, como curvas, texturas e sombras.

Nessa sprint, o foco foi realizar a classificação de imagens em duas categorias distintas e, por esse motivo, o modelo `YOLO11n-cls` foi o escolhido pois além de ser o mais recente, com aprimoramentos significativos na arquitetura e métodos de treinamento, ele é específico para classificação de imagens. 

## 3. Organização do Dataset:

As imagens utilizadas no treinamento e validação foram fornecidas diretamente pelo cliente, garantindo que o modelo seja treinado com base em condições reais e representativas das fissuras presentes em suas estruturas.

Para que o modelo reconheça as classes corretamente, o dataset foi estruturado seguindo o padrão exigido para tarefas de classificação com YOLO:

```plaintext
fissura_dataset/
├── train/
│   ├── fissura_retracao/
│   └── fissura_termica/
└── val/
    ├── fissura_retracao/
    └── fissura_termica/
```

Cada subpasta contém imagens exclusivamente da respectiva classe. Ao organizar dessa maneira o modelo é capaz de inferir automaticamente quais são as classes envolvidas, sem a necessidade de arquivos `.yaml`, por exemplo. Além disso, ele consegue mapear corretamente os rótulos com base na hierarquia das pastas e facilita o uso do método `.train()`, pois o caminho do diretório já contém toda a informação necessária. 

## 4. Treinamento:

O treinamento foi realizado utilizando a biblioteca Ultralytics, que oferece uma API eficiente para aplicar modelos da família YOLO em tarefas de classificação: `mode=cls`. 

O modelo carregado foi o `YOLO11n-cls.pt`, uma versão leve e já pré-treinada com o dataset ImageNet. O objetivo era realizar fine-tuning, ou seja, ajustar o modelo pré-existente à tarefa específica de classificar fissuras térmicas e de retração.

O processo de treinamento foi iniciado com o seguinte código:

```plaintext

# from ultralytics import YOLO

# model = YOLO("yolo11n-cls.pt")

# model.train(
#     data="C:/Users/pietr/Documents/modulo6/2025-1B-T12-EC06-G01/src/machineLearning/fissura_dataset", 
#     epochs=50, 
#     imgsz=224,
#     patience=10) 

from ultralytics import YOLO

# Etapa 2: Carrega modelo pré-treinado
model = YOLO("yolo11s-cls.pt")

# Etapa 3: Treinamento com boas práticas
model.train(
    data="fissura_dataset", 
    epochs=50,
    imgsz=224,
    patience=5,
    plots=True
)
```

Foi utilizado o modelo `YOLO11n-cls`, a versão mais leve da família YOLO11 para classificação de imagens. A escolha se baseou na limitação do volume de dados disponíveis e na menor propensão ao overfitting. Modelos maiores, como o `YOLO11x-cls`, exigiriam mais dados, maior capacidade computacional e poderiam comprometer a generalização do modelo neste estágio inicial.

## 5. Avaliação:

Após o treinamento, o modelo `YOLO11n-cls` foi avaliado utilizando seu conjunto de validação. A acurácia obtida foi de 100%, o que significa que o modelo classificou corretamente todas as imagens validadas.

```
from ultralytics import YOLO

model = YOLO("runs/classify/train5/weights/best.pt")
metrics = model.val()

print(f"Acurácia top-1: {metrics.top1:.3f}")

```
#### Resultado Obtido: 

- Acurácia top-1: 100.0%

Esse resultado também se manteve ao testar o modelo com um conjunto externo de imagens modificadas — com pequenas alterações visuais, como rotação, variações de brilho e contraste. Embora esse desempenho pareça ideal, ele requer uma análise mais cuidadosa. 

Uma acurácia perfeita pode indicar que o modelo está superajustado (sofrendo **overfitting**) ao conjunto de dados.

O **overfitting** ocorre quando o modelo aprende muito bem os exemplos de treino e de validação, mas não necessariamente aprende a generalizar. Ele pode estar decorando padrões específicos das imagens (como fundos, texturas ou posicionamentos), ao invés de aprender características realmente relevantes da classe.

Isso pode estar ocorrendo por alguns motivos, dentre eles:

- As imagens das duas classes possuem características visuais muito semelhantes (ex: fundo claro, mesma tonalidade de cor, variando apenas o formato da fissura).
- O dataset é pequeno, o que facilita a memorização ao invés da generalização.
- As modificações aplicadas nas imagens de teste foram leves para desafiar o modelo — mantendo estrutura visual semelhante ao conjunto original.

Ter 100% de acurácia não significa obrigatoriamente que há erro, mas exige uma análise mais rigorosa. É possível que ele esteja realmente aprendendo a tarefa corretamente, caso as diferenças entre os tipos de fissura sejam suficientemente distintas para não gerar ambiguidade. No entanto, também é possível que ele esteja apenas reconhecendo padrões repetitivos e pouco variados. 

Em resumo, mesmo que esteja overfitando, isso não desqualifica o modelo, mas é necessário validação extra como aumentar o dataset com novas imagens e em condições diferentes.

## 6. Próximos Passos:

Para validar a real capacidade do modelo, algumas ações serão feitas nas próximas semanas:

- Aumentar o dataset com novas imagens, em diferentes condições;
- Aplicar data augmentation mais agressiva;
- Inserir distrações (fundos aleatórios) para validar o foco do modelo;
- Comparar com outros modelos para verificar qual modelo se alinha melhor ao objetivo desse projeto.

## 7. Conclusão:

O uso do modelo `YOLO11n-cls` para classificação de fissuras mostrou-se promissor nesta etapa inicial, com acurácia perfeita tanto em validação quanto em generalização simulada. No entanto, a ausência de erros levanta dúvidas sobre possível overfitting e baixa variabilidade no dataset.

As próximas sprints se concentrarão na robustez do modelo, validação prática, e incremento dos dados, com objetivo de garantir que os resultados reflitam a realidade e não apenas a memória do modelo sobre os exemplos de treino.




