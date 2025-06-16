---
title: Retreinamento
sidebar_position: 3
---
## Documentação da Feature: Retreinamento do Modelo de Classificação

### Objetivo

Esta feature permite realizar o **retreinamento do modelo de classificação de imagens de fissuras**, baseado nos veredictos previamente atribuídos a imagens no banco de dados. A funcionalidade é exposta por meio de uma rota REST e seu progresso é transmitido ao frontend por WebSocket.

---

## Componentes e Responsabilidades

### 1. **`ClassifyRoute.py`**

* Define a rota: `POST /classify/retrain`
* Responsável por acionar o controller correspondente ao retreinamento.

---

### 2. **`ClassifyController.py`**

Contém a lógica principal para iniciar o processo de retreinamento:

* Método: `retrain()`

#### Fluxo interno:

1. Acessa o repositório de imagens:

   * `ImageRepository.read_veredict_images_per_facade()`
   * Recupera imagens com **veredicto definido** e **nome não preenchido** (ainda não baixadas).
2. Acessa o repositório de tipos de fissura:

   * `FissureRepository.read_fissure_types()`
3. Utiliza utilitários para preparar os dados:

   * `DirectoryUtil.all_fissures()` → Cria pastas para os tipos de fissuras.
   * `DirectoryUtil.download_images()` → Baixa as imagens do banco nas respectivas pastas de fissura.
4. Divide as imagens:

   * `split_images()` → Cria conjuntos de treino (70%), validação (20%) e teste (10%).
5. Inicia o processo de retreinamento via WebSocket:

   * `websocket.handle_training()` → Gera uma thread para o treinamento.

---

### 3. **`websocket.py`**

* Define a função `send_message(msg)` para enviar mensagens via WebSocket.
* Define a função `handle_training()` com o decorador `@socketio.on(...)`, que:

  * Inicia uma nova thread chamando `train_model()` do módulo de treino.

---

### 4. **`train.py`**

Módulo central de execução do retreinamento. Contém:

#### a) `import_ws()`

Função utilitária para importar dinamicamente módulos e instanciar objetos importantes fora do escopo visível:

```python
sys.path.append(...)
from server.main import get_app
from server.app.websocket import send_message
from server.app.Utils.DiretoryUtil import DiretoryUtil
```

* Retorna: `util`, `current_app`, `send_message`

#### b) `train_model()`

Executa o treinamento do modelo YOLO:

```python
model = YOLO("yolo11n-cls.pt")
model.train(...)
```

* Define diretórios, configurações e salva os resultados em um novo diretório em `classify/runs/train_<data>`.
* Inicia monitoramento em background via:

```python
socketio.start_background_task(monitorar_epochs, log_path, 50)
```

#### c) `monitorar_epochs(log_path, total_epochs)`

* Monitora o progresso do treinamento com base nos logs.
* Envia atualizações de progresso via `send_message()`.
* Utiliza:

  * `DirectoryUtil.get_train_version()` → Lê o nome do novo diretório de treino criado.
  * `ClassificationRepository.create_new_version()` → Registra uma nova versão do modelo treinado no banco.

---

### 5. **`ImageRepository.py`**

* Método: `read_veredict_images_per_facade()`
* Retorna imagens com:

  * `veredict` preenchido 
  * `name` não preenchido (indica que ainda não foram baixadas)

---

### 6. **`FissureRepository.py`**

* Método: `read_fissure_types()`
* Retorna todos os tipos de fissuras cadastrados no banco de dados.

---

### 7. **`DirectoryUtil.py`**

Utilitário responsável por preparar a estrutura de pastas e arquivos:

* `all_fissures()` → Cria diretórios para cada tipo de fissura
* `download_images()` → Baixa as imagens nas pastas corretas
* `get_train_version()` → Recupera o nome do último diretório de treino criado

---

### 8. **`ClassificationRepository.py`**

* Método: `create_new_version(train_version)`
* Registra uma nova entrada de versão na tabela `model_version` do banco de dados.

---

## Estado Atual e Limitações

A feature **ainda não está 100% funcional**, devido a problemas na **concorrência entre WebSocket e o contexto da aplicação Flask** (`app`):

* Ao tentar usar `send_message()` para envio de atualizações via WebSocket dentro de `train_model()` ou `monitorar_epochs`, ocorrem conflitos com a conexão com o banco de dados.
* Há um impasse técnico onde **ou** o WebSocket funciona corretamente **ou** as consultas ao banco de dados funcionam – mas não ambos simultaneamente, provavelmente devido à forma como a thread secundária manipula o contexto da aplicação (`current_app`).

**Próximos passos sugeridos:**

* Reestruturar o gerenciamento do contexto da aplicação no treinamento.
* Avaliar o uso de `with app.app_context():` dentro da thread.
