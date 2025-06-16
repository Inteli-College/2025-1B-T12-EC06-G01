# Guia de Configuração e Execução do Projeto

Este documento detalha todos os passos necessários para configurar e executar o ambiente de desenvolvimento completo do projeto, incluindo o backend, o frontend e o fluxo de Machine Learning.

## 1. Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:
* **Python** (versão 3.10 ou superior)
* **Git**
* **Node.js** e **npm** (para o frontend, versão 18 ou superior)

## 2. Configuração Inicial do Ambiente

### 2.1. Clonar o Repositório

Primeiro, clone o repositório do projeto do GitHub para a sua máquina local.

```bash
git clone [https://github.com/Inteli-College/2025-1B-T12-EC06-G01.git](https://github.com/Inteli-College/2025-1B-T12-EC06-G01.git)
cd 2025-1B-T12-EC06-G01
```

### 2.2. Criar e Ativar o Ambiente Virtual (`venv`)

É uma boa prática isolar as dependências do projeto em um ambiente virtual.

```bash
# Crie o ambiente virtual na raiz do projeto
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate

# No macOS ou Linux:
source venv/bin/activate
```
Você saberá que o ambiente está ativo quando o nome `(venv)` aparecer no início do seu prompt de comando.

## 3. Instalação das Dependências

Com o `venv` ativo, instale todas as bibliotecas necessárias para cada parte do sistema.

### 3.1. Dependências do Backend (Servidor)

O backend em Flask precisa de um conjunto de bibliotecas para funcionar.

```bash
# Assumindo que você está na raiz do projeto
pip install -r src/server/requirements.txt
```

### 3.2. Dependências de Machine Learning

O fluxo de treinamento e inferência com YOLO utiliza pacotes específicos.

```bash
# Assumindo que você está na raiz do projeto
pip install -r src/machineLearning/requirements.txt
```

### 3.3. Dependências do Frontend

O frontend (provavelmente em React/Vue/Angular) tem suas próprias dependências gerenciadas pelo `npm`.

```bash
# Navegue até a pasta do frontend
cd src/frontend

# Instale os pacotes
npm install

# Volte para a raiz do projeto quando terminar
cd ../..
```

## 4. Configuração de Variáveis de Ambiente e Serviços

Segredos como chaves de API e URLs de banco de dados não devem estar no código. Eles são gerenciados através de um arquivo `.env`.

### 4.1. Arquivo de Ambiente (`.env`)

1.  Na raiz do projeto (`2025-1B-T12-EC06-G01/`), crie um arquivo chamado `.env`.
2.  Copie o conteúdo abaixo e cole no seu arquivo `.env`, substituindo os valores pelos seus segredos.

```env
# Arquivo .env

# Chave secreta para assinar os tokens JWT (gere uma chave aleatória)
# Use o comando: python -c 'import secrets; print(secrets.token_hex(32))'
SECRET_KEY="sua_chave_secreta_gerada_aqui"

# URL de conexão com o banco de dados PostgreSQL do Render.com
# IMPORTANTE: Adicione "?sslmode=require" no final!
POSTGRE_URL="postgresql://seu_usuario:sua_senha@seu_[host.render.com/seu_banco?sslmode=require](https://host.render.com/seu_banco?sslmode=require)"

# Credenciais do Cloudinary para armazenamento de imagens
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

### 4.2. Conexão com Banco de Dados (Render.com)

1.  Acesse seu painel no [Render.com](https://render.com/).
2.  Crie um novo banco de dados PostgreSQL (se ainda não tiver um).
3.  Na página do seu banco, copie a "External Database URL".
4.  Cole esta URL no campo `POSTGRE_URL` do seu arquivo `.env`, lembrando de adicionar `?sslmode=require` ao final.
5.  Verifique a aba "Networking" e adicione seu endereço de IP a "Trusted Sources" para permitir a conexão.

### 4.3. Conexão com Cloudinary

1.  Acesse seu painel no [Cloudinary](https://cloudinary.com/).
2.  No Dashboard, você encontrará seu `Cloud Name`, `API Key` e `API Secret`.
3.  Copie e cole esses valores nos campos correspondentes do seu arquivo `.env`.

### 4.4. Migração do Banco de Dados

Com a `POSTGRE_URL` configurada, você precisa criar as tabelas no seu banco de dados pela primeira vez.

```bash
# Navegue até a pasta do servidor
cd src/server

# Exporte a variável de ambiente para o Flask encontrar o app
# No Windows:
set FLASK_APP=app
# No macOS ou Linux:
export FLASK_APP=app

# Execute o upgrade para criar todas as tabelas
flask db upgrade

# Volte para a raiz do projeto
cd ../..
```

## 5. Executando a Aplicação Completa

Para rodar a aplicação, você precisará de dois terminais abertos, ambos com o `venv` ativado.

### 5.1. Executando o Backend

No primeiro terminal:

```bash
# Navegue até a pasta do servidor
cd src/server/app

# Inicie o servidor Flask
python3 main.py
```
O backend estará rodando em `http://127.0.0.1:5000`.

### 5.2. Executando o Frontend

No segundo terminal:
```bash
# Navegue até a pasta do frontend
cd src/frontend

# Inicie o servidor de desenvolvimento
npm start
```
O frontend estará rodando em `http://localhost:3000`.

## 6. Fluxo de Machine Learning (Treinamento Manual)

Este fluxo é executado localmente para preparar dados e treinar novas versões do modelo.

### 6.1. Preparação do Dataset (`split.py`)

Este script pega uma pasta de imagens originais (separadas por classe) e as divide em pastas `train`, `val` e `test`.

1.  Abra o arquivo `src/machineLearning/split.py`.
2.  Edite as variáveis `origem` e `destino` para apontar para os caminhos corretos na sua máquina.
3.  Execute o script:
    ```bash
    python src/machineLearning/split.py
    ```

### 6.2. Treinamento do Modelo (`train.py`)

Este script inicia o treinamento do YOLO usando o dataset preparado e o arquivo de configuração `meu_config.yaml`.

1.  Execute o script de treinamento:
    ```bash
    python src/machineLearning/train.py
    ```
2.  O progresso será exibido no terminal. Ao final, os resultados, incluindo o melhor modelo (`best.pt`), serão salvos em uma nova pasta dentro de `src/machineLearning/runs/classify/`.

### 6.3. Avaliação do Modelo (`avaliacao_modelo.py`)

Use este script para testar a acurácia de um modelo já treinado.

1.  Abra o arquivo `src/machineLearning/avaliacao_modelo.py`.
2.  Edite a variável `model_path` para apontar para o arquivo `.pt` que você deseja avaliar (ex: `runs/classify/train/weights/best.pt`).
3.  Execute o script:
    ```bash
    python src/machineLearning/avaliacao_modelo.py
    ```

### 6.4. Testando a Generalização (`generalizacao.py`)

Use este script para classificar imagens novas que não fazem parte do dataset.

1.  Crie uma pasta de teste (ex: `src/machineLearning/test_images_novas`).
2.  Coloque algumas imagens `.jpg` ou `.png` dentro dela.
3.  Execute o script, apontando para a sua pasta e para o modelo desejado:
    ```bash
    # Deixando o script encontrar o melhor modelo automaticamente
    python src/machineLearning/generalizacao.py --test_folder src/machineLearning/test_images_novas

    # Especificando um modelo
    python src/machineLearning/generalizacao.py --test_folder src/machineLearning/test_images_novas --model_path runs/classify/train/weights/best.pt
    ```