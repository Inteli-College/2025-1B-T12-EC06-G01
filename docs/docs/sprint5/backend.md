---
title: "Backend"
sidebar_position: 2
---

# Documentação Técnica - Backend do Projeto de Classificação Automática de Fissuras

## Introdução

O presente documento tem como objetivo descrever, de forma geral e objetiva, a estrutura e funcionamento do backend do projeto de **classificação automática de fissuras em fachadas de prédios**, utilizando imagens capturadas por drones e processadas via redes neurais. A solução proposta visa facilitar a inspeção predial por meio de um sistema que automatiza a identificação e classificação de fissuras, além de oferecer funcionalidades de retreinamento, geração de relatórios e gerenciamento de usuários e entidades relacionadas.

O backend foi desenvolvido em **Python**, utilizando o framework **Flask**, com o suporte de bibliotecas para comunicação via **WebSocket**, acesso a banco de dados via **SQLAlchemy (ORM)**, e integração com serviços externos como **PostgreSQL** e **Cloudinary**.

---

## Organização e Arquivos

A pasta raiz do backend encontra-se no diretório: `2025-1B-T12-EC06-G01/src/server`


A organização interna do backend é a seguinte:

- `main.py`: Inicia a aplicação Flask.
- `requirements.txt`: Define as dependências do projeto.
- `app/`: Diretório principal do backend com as seguintes subpastas e arquivos:
  - `__init__.py`: Criação e configuração da aplicação e de suas dependências.
  - `websocket.py`: Eventos e funções do WebSocket.
  - `queue_manager.py`: Sistema de fila FIFO para mensagens do WebSocket.
  - `config.py`: Strings de conexão e variáveis de configuração.
  - `Models/`: Modelos das entidades do banco de dados (ORM).
  - `Routes/`: Arquivos de definição de rotas do sistema.
  - `Controllers/`: Endpoints e lógica de controle intermediária.
  - `Services/`: Regras de negócio associadas a certas rotas.
  - `Repositories/`: Acesso ao banco de dados, com CRUD das entidades.
  - `Utils/`: Funções auxiliares, como download de imagens.

As pastas `Routes`, `Controllers`, `Repositories` e `Models` são organizadas conforme as entidades do banco, como `ImageRoute`, `BuildingRepository`, `fissure`, etc.

---

## Funcionalidades do Sistema

1. **Classificação automática**: Classifica imagens de fachadas com base no modelo atual.
2. **Retreinamento**: Permite retreinar o modelo com imagens antigas e novas.
3. **Relatório automático**: Geração de relatórios com resumo e detalhamento por projeto.
4. **Manipulação de entidades**: Gerencia Projetos, Prédios, Fachadas e Imagens (CRUD).
5. **Gerenciamento de versões do modelo**: Permite visualizar e alterar o modelo em uso.
6. **Gerenciamento de usuários**: Cadastro, login, leitura e exclusão de usuários.

---

## Objetos e Funcionalidades

| Funcionalidade | Rota (Route) | Controller | Service / Util / Repository |
|----------------|--------------|------------|------------------------------|
| **1. Classificação automática** | `ClassifyRoute.py`: `classify/facade/<int:facade_id>` | `ClassifyController.py`: `postClassify` | `ClassifyService.py`: `classify_facade_images` |
| **2. Retreinamento** | `ClassifyRoute.py`: `classify/retrain` | `ClassifyController.py`: `retrain` | `DirectoryUtil.py`: `all_fissures`, `download_images` |
| **3. Relatório automático** | `ReportRoute.py`: `projects/<int:project_id>/report` | `ReportController.py`: `get_project_report` | `ReportService.py`: `generate_project_report` |
| **4. Manipulação de Projetos** | `ProjectRoute.py` | `ProjectController.py` | `ProjectRepository.py` |
| **4. Manipulação de Prédios** | `BuildingRoute.py` | `BuildingController.py` | `BuildingRepository.py` |
| **4. Manipulação de Fachadas** | `FacadeRoute.py` | `FacadeController.py` | `FacadeRepository.py` |
| **4. Manipulação de Imagens** | `ImageRoute.py` | `ImageController.py` | `ImageRepository.py` |
| **5. Gerenciamento de versões do modelo** | `ClassifyRoute.py`: `classify/version [GET, PUT]` | `ClassifyController.py`: `get_model_version`, `put_model_version_true` | `ClassifyRepository.py`: `create_new_version`, `update_version_true` |
| **6. Gerenciamento de usuários** | `UsersRoute.py`: `get_user_id`, `get_user_name`, `register`, `login`, `delete` | `UsersController.py`: `get_user_by_id`, `get_user_by_name`, `register`, `login`, `delete_user_by_id` | `UsersRepository.py`: `get_user_by_id`, `get_user_by_name`, `create_user`, `get_user_by_email`, `delete_user` |

---

## Conclusão

A arquitetura do backend foi projetada com foco em modularidade, clareza e escalabilidade, utilizando uma separação de responsabilidades que abrange camadas distintas como rotas, controladores, serviços e repositórios. Essa organização permite a fácil manutenção e expansão do sistema, além de facilitar a integração com o frontend e o treinamento contínuo do modelo de classificação. A documentação apresentada oferece uma visão geral e funcional das principais partes do backend, servindo como guia introdutório para novos desenvolvedores e colaboradores do projeto.


