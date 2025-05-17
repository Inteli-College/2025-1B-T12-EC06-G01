---
title: Rota de filtros
sidebar_position: 1
---

# Rota de Filtros

Essa rota foi pensada com base nas user stories e wireframes elaborados, possuindo como objetivo ser possível o usuário filtrar as imagens que ele adicionou por data e em ordem crescente ou decrescente. Nesse sentido, segue abaixo o wireframe relacionado ao desenvolvimento dessa rota:


![Wireframe da tela revisão de imagens](../../../static/img/wireframe_tela_review.png)



## **Endpoint:** `/projects/<int:project_id>/filter/images`

### **Método:** `GET`

---

## 🔹 **Parâmetros da consulta:**

| Parâmetro   | Tipo    | Obrigatório | Descrição                                |
|--------------|---------|-------------|----------------------------------------|
| `start_date` | string  | Não         | Data inicial no formato ISO-8601        |
| `end_date`   | string  | Não         | Data final no formato ISO-8601          |
| `order`      | string  | Não         | Define a ordenação (`asc` ou `desc`)    |

---

## **Exemplo de Requisição:**

```bash
curl -X GET "http://localhost:5000/projects/1/filter/images?start_date=2023-01-01&end_date=2023-01-31&order=desc"
```

---

##  **Exemplo de Resposta:**

```json
[
  {
    "id": 1,
    "raw_image": "https://example.com/image1.jpg",
    "datetime": "2023-01-01T15:00:00",
    "latitude": -23.5678,
    "longitude": -46.6789,
    "fissure_type": "horizontal",
    "veredict": "fissura crítica"
  },
  {
    "id": 2,
    "raw_image": "https://example.com/image2.jpg",
    "datetime": "2023-01-02T12:00:00",
    "latitude": -23.5678,
    "longitude": -46.6789,
    "fissure_type": "vertical",
    "veredict": "fissura leve"
  }
]
```

---

## **Possíveis Erros:**

| Código | Descrição                      |
|---------|-------------------------------|
| `400`   | Formato de data inválido     |

```json
{
  "error": "formato de data inválido"
}
```

---


---

##  **Fluxo de Chamadas Internas:**

1. **FilterRoute.py** → Define a rota `/filter/images`.
2. **ImageReviewController.py** → Recebe a requisição e repassa para o Service.
3. **ImageFilterService.py** → Filtra as imagens no banco de dados.
4. **ImageFilterRepository.py** → Executa a query para buscar as imagens.

---

