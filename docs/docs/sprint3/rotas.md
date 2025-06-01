---
title: Rotas Desenvolvidas na Sprint
sidebar_position: 2
---
# Rotas Desenvolvidas na Sprint
As rotas desenvolvidas nesta sprint foram criadas com o objetivo de viabilizar a integração da primeira tela do sistema, que representa o fluxo de navegação entre **Projetos → Prédios → Fachadas → Imagens**. Essa estrutura reflete a hierarquia dos dados capturados por drones, fundamentais para o projeto de **classificação automática de fissuras**, desenvolvido em parceria com o IPT (Instituto de Pesquisas Tecnológicas).

A definição dessas rotas permite que o frontend acesse de forma organizada e eficiente as informações necessárias para exibir os diferentes níveis da estrutura do projeto, garantindo uma navegação fluida e lógica desde o projeto inicial até as imagens específicas de cada fachada, que serão analisadas pelo modelo de classificação.

---

# Rotas de Projeto
Essas rotas são responsáveis por acessar a tabela ```projects``` do banco de dados, que guarda os todos os registros de projetos criados por pesquisadores do IPT. Seu desenvolvimento nessa sprint aconteceu pensando na integração da tela de visualização de projetos. 
- **URL : ```/projects```, Método HTTP : `POST`** - Reponsável por criar um novo projeto.
- **URL : `/projects`, Método HTTP : `GET`** - Reponsável por acessar todos os projetos cadastrados.

---

# Rotas de Prédios
Responsáveis por manipular a tabela `building` do banco de dados, as rotas `building` fazem um papel fundamental na hora do fluxo de dados. Após abrir no front-end uma pasta qualquer de projeto, essas rotas são responsáveis por criar um novo prédio e ver prédios associados aquele projeto.
- **URL : ```/building```, Método HTTP : `POST`** - Reponsável por criar um novo prédio em um projeto.
- **URL : ```/building```, Método HTTP : `GET`** - Reponsável por acessar todos os prédios cadastrados em um projeto.

---

# Rotas de Fachada
As rotas de fachada tem seu papel a visualização e criação de novos registros na tabela `facade`, elas recebem `building_id` e conseguem manipular os dados conforme.
- **URL : ```/facade```, Método HTTP : `POST`** - Reponsável por criar uma nova fachada em um prédio.
- **URL : ```/facade/get```, Método HTTP : `POST`** - Reponsável por acessar todas as fachadas cadastradas em um prédio.

---

# Rotas de Imagens
As rotas de imagens variam de funcionalidade, elas pensam além da tela de visualização de Projetos, Pŕedios e Fachadas. A URL `images`, compõe 4 rotas, sendo 3 delas desenvolvidas nessa sprint:
- **URL : ```/images```, Método HTTP : `POST`** - Reponsável por depositar novas imagens de fachadas no Cloudinary (banco de imagens) e criar um registro no banco com o URL correspondente.
- **URL : ```/images```, Método HTTP : `GET`** - Reponsável por acessar todas as imagens de uma determinada fachada.
- **URL : ```/images/classified```, Método HTTP : `GET`** - Reponsável por acessar todas as imagens classificadas de um determinado prédio.

---

# Conclusão

Com o conjunto de rotas desenvolvidas nesta sprint, o grupo Rooster estabeleceu a base necessária para a estruturação e navegação inicial do sistema, permitindo que o frontend interaja de forma organizada com os dados armazenados. A modelagem das rotas seguiu a hierarquia real do processo de coleta e análise das imagens — **Projetos → Prédios → Fachadas → Imagens** — garantindo que cada recurso possa ser acessado e manipulado com clareza e eficiência.

Essas rotas não apenas viabilizam a visualização completa do fluxo de imagens capturadas por drones, como também permitem a adição de novos dados ao sistema, sempre mantendo o vínculo entre imagem, fachada, prédio e projeto. Isso será fundamental para garantir a escalabilidade da plataforma e a rastreabilidade dos dados utilizados nos modelos de classificação automática de fissuras, reforçando o alinhamento técnico com os objetivos do projeto em parceria com o IPT.


