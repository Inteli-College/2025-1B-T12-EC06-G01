---
title: Rota de Limpeza de Imagens
sidebar_position: 3
---

# Rota de Limpeza de Imagens

Essa rota foi desenvolvida para permitir a limpeza dos dados de imagens armazenadas no sistema, possibilitando a remoção dos arquivos de imagem tanto do banco de dados quanto do serviço de armazenamento Cloudinary. A funcionalidade é essencial para gerenciamento de espaço e para atender requisitos de privacidade e controle de dados.


## **Endpoint:** `/api/images/<int:image_id>/clean`

### **Método:** `PUT`

## 🔹 **Path Params:**

| Parâmetro   | Tipo    | Obrigatório | Descrição                                |
|--------------|---------|-------------|----------------------------------------|
| `image_id`   | integer | Sim         | ID da imagem que será limpa             |

---

## 🔹 **Exemplo de Requisição:**

```bash
curl -X PUT "http://localhost:5000/api/images/42/clean" \
     -H "Content-Type: application/json"
```

---

## 🔹 **Exemplo de Resposta:**

```json
{
  "message": "Imagem limpa com sucesso",
  "image": {
    "id": 42,
    "project_id": 5,
    "datetime": "2023-09-15 14:30:22",
    "latitude": "-23.550520",
    "longitude": "-46.633308",
    "fissure_type": "transversal",
    "veredict": "moderada"
  },
  "cloudinary_operations": {
    "raw_image": {
      "result": "ok"
    },
    "fresh_img": {
      "result": "ok"
    }
  }
}
```

---

## 🔹 **Possíveis Erros:**

| Código | Descrição                        |
|---------|--------------------------------|
| `400`   | ID da imagem é obrigatório     |
| `404`   | Imagem não encontrada          |
| `500`   | Erro interno do servidor       |

```json
{
  "error": "Imagem com ID 42 não encontrada"
}
```

```json
{
  "error": "Erro ao deletar imagem do Cloudinary: Invalid credentials"
}
```

---

## 🔄 **Fluxo de Chamadas Internas:**

1. **ImageCleanRoutes.py** → Define a rota `/api/images/<int:image_id>/clean`.
2. **ImageCleanController.py** → Valida os parâmetros e coordena a operação de limpeza.
3. **ImageCleanRepository.py** → Executa a limpeza dos campos de imagem no banco de dados e remoção das imagens do Cloudinary.

---

## 📋 **Detalhes de Implementação:**

- A operação limpa os campos `raw_image` e `fresh_img` da tabela de imagens.
- Os arquivos físicos são removidos do serviço Cloudinary usando a API oficial.
- A operação é transacional - se a remoção do Cloudinary falhar, as alterações no banco de dados são revertidas.
- O sistema registra logs detalhados da operação para fins de auditoria.

---

## 💻 **Considerações Técnicas:**

- É necessário configurar as credenciais do Cloudinary nas variáveis de ambiente:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
