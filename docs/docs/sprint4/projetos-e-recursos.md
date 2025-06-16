---
sidebar_label: 'Projetos e Recursos'
title: 'API de Projetos e Recursos'
---

# API de Projetos e Recursos

Estes endpoints cobrem todas as operações relacionadas a projetos, desde a criação e filtragem até a edição de nomes e a geração de relatórios detalhados.

**Autenticação:** A menos que especificado, presume-se que todas as rotas que modificam dados (`POST`, `PUT`, `DELETE`) ou acessam dados sensíveis (relatórios) requerem um token JWT no cabeçalho `Authorization`.

---

## Projetos

### Listar e Filtrar Projetos

Retorna uma lista de projetos, com opções de filtro.

`GET /projects`

:::note Status da Integração do Filtro

Atenção: A funcionalidade de **filtragem por contratante, data e ordem** está implementada e funcional no backend. A integração destes filtros (ex: campos de data, dropdown de contratante) na tela do frontend **ainda está pendente**.

:::

#### Parâmetros de Query (Opcionais)

* `contractor` (string): Filtra por nome exato do contratante.
* `start_date` (string `YYYY-MM-DD`): Filtra por projetos a partir desta data.
* `end_date` (string `YYYY-MM-DD`): Filtra por projetos até esta data.
* `order` (string `asc`|`desc`): Ordena os resultados pelo nome do projeto. O padrão é `asc`.

#### Resposta de Sucesso (200 OK)

```json
[
  {
    "id": 1,
    "name": "Projeto Legalzao",
    "contractor": "Construtora X",
    "date": "2025-06-12T18:00:00"
  }
]
```

---

### Criar Novo Projeto

`POST /projects`

#### Corpo da Requisição (Body)
```json
{
  "name": "Novo Projeto Residencial",
  "contractor": "Construtora Y",
  "date": "2025-07-01"
}
```

#### Resposta de Sucesso (201 Created)
Retorna o objeto do projeto recém-criado.

---

### Atualizar Nome do Projeto

`PUT /projects/<int:project_id>/name`

#### Corpo da Requisição (Body)
```json
{
  "name": "Nome Atualizado do Projeto"
}
```
#### Resposta de Sucesso (200 OK)
```json
{
  "code": 200,
  "message": "Project name updated successfully",
  "project": {
    "id": 1,
    "name": "Nome Atualizado do Projeto"
  }
}
```

---

## Prédios

### Atualizar Nome do Prédio

`PUT /buildings/<int:building_id>/name`

#### Corpo da Requisição (Body)
```json
{
  "name": "Nome Atualizado do Prédio"
}
```
#### Resposta de Sucesso (200 OK)
Retorna o objeto do prédio atualizado.

---

## Fachadas

### Atualizar Nome da Fachada

`PUT /facades/<int:facade_id>/name`

#### Corpo da Requisição (Body)
```json
{
  "name": "Nome Atualizado da Fachada"
}
```
#### Resposta de Sucesso (200 OK)
Retorna o objeto da fachada atualizada.

---

## Recursos Adicionais

### Listar Contratantes

Retorna uma lista de todos os nomes de contratantes únicos para popular menus dropdown.

`GET /contractors`

#### Resposta de Sucesso (200 OK)
```json
[
  "Construtora X",
  "Construtora Y",
  "Inteli"
]
```

---

### Gerar Relatório do Projeto

Gera um relatório consolidado e detalhado para um projeto específico.

`GET /projects/<int:project_id>/report`

#### Resposta de Sucesso (200 OK)
Retorna o objeto completo do relatório, conforme o último exemplo que validamos.

---

### Classificar Imagens da Fachada

Inicia o processo de classificação por IA para todas as imagens de uma fachada específica, com filtros de data opcionais.

`POST /facades/<int:facade_id>/classify`

#### Corpo da Requisição (Body - Opcional)
```json
{
  "start_date": "2025-01-01T00:00:00",
  "end_date": "2025-03-31T23:59:59"
}
```

#### Resposta de Sucesso (200 OK)
Retorna um dicionário com as URLs das imagens como chaves e os resultados da classificação como valores.
```json
{
  "http://.../img1.jpg": { "class": "fissura_termica", "confidence": 0.92 },
  "http://.../img2.jpg": { "error": "Could not download image" }
}
```