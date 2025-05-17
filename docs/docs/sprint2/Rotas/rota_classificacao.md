---
title: Rota de Classificação
sidebar_position: 2
---

# Rota de Classificação de Imagens

Essa rota foi pensada com base nas user stories e wireframes elaborados, possuindo como objetivo desenvolver a lógica de negócios necessárias para a plena ativação do modelo, sendo acionado quando o usuário selecionar o botão de "Enviar". Nesse sentido, segue abaixo o wireframe relacionado ao desenvolvimento dessa rota:

![Wireframe da tela de revisão de imagens](../../../static/img/wireframe_tela_review.png)

## **Endpoint:** `/projects/<int:project_id>/classify/images`

### **Método:** `POST`

## 🔹 **Body Params (opcional):**

| Parâmetro   | Tipo    | Obrigatório | Descrição                                |
|--------------|---------|-------------|----------------------------------------|
| `start_date` | string  | Não         | Data inicial no formato ISO-8601        |
| `end_date`   | string  | Não         | Data final no formato ISO-8601          |

---

## 🔹 **Exemplo de Requisição:**

```bash
curl -X POST "http://localhost:5000/projects/1/classify/images" \
     -H "Content-Type: application/json" \
     -d '{
           "start_date": "2023-01-01",
           "end_date": "2023-01-31"
         }'
```

---

## 🔹 **Exemplo de Resposta:**

```json
{
  "project_id": 1,
  "classified_images": [
    {
      "id": 1,
      "raw_image": "https://example.com/image1.jpg",
      "classification": "fissura crítica"
    },
    {
      "id": 2,
      "raw_image": "https://example.com/image2.jpg",
      "classification": "fissura leve"
    }
  ]
}
```

---

## 🔹 **Possíveis Erros:**

| Código | Descrição                        |
|---------|--------------------------------|
| `500`   | Erro interno durante a classificação |

```json
{
  "error": "Erro ao classificar imagens."
}
```

---


## 🔄 **Fluxo de Chamadas Internas:**

1. **FilterRoute.py** → Define a rota `/classify/images`.
2. **ImageReviewController.py** → Executa a classificação.
3. **ImageClassificationService.py** → Baixa as imagens e chama o modelo de classificação.

---

