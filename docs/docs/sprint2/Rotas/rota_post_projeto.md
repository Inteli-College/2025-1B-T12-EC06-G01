---
title: Rota de Criação de Projeto
sidebar_position: 5
---

# Rota de Criação de Projeto

Essa rota permite a criação de novos projetos no sistema. É essencial para registrar informações iniciais dos projetos, como nome, contratante e data, garantindo que o sistema tenha dados atualizados para gerenciamento.

## **Endpoint:** `/api/projects/`

### **Método:** `POST`

## 🔹 **Body Params:**

| Parâmetro    | Tipo   | Obrigatório | Descrição                                                                   |
| ------------ | ------ | ----------- | --------------------------------------------------------------------------- |
| `name`       | string | Sim         | Nome do projeto                                                             |
| `contractor` | string | Sim         | Nome do contratante do projeto                                              |
| `date`       | string | Não         | Data do projeto (formato ISO ou string). Se não fornecida, usa a data atual |

---

## 🔹 **Exemplo de Requisição:**

```bash
curl -X POST "http://localhost:5000/api/projects/" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Projeto de Construção X",
           "contractor": "Construtora ABC",
           "date": "2025-05-19T10:00:00"
         }'
```

---

## 🔹 **Exemplo de Resposta:**

```json
{
  "id": 12,
  "nome": "Projeto de Construção X",
  "contractor": "Construtora ABC",
  "date": "2025-05-19T10:00:00"
}
```

---

## 🔹 **Possíveis Erros:**

| Código | Descrição                             |
| ------ | ------------------------------------- |
| `400`  | Dados JSON insuficientes ou inválidos |
| `500`  | Erro interno do servidor              |

```json
{
  "code": 400,
  "message": "'name'"
}
```

```json
{
  "code": 500,
  "message": "Database connection error"
}
```

---

## 🔄 **Fluxo de Chamadas Internas:**

1. **ProjectRoutes.py** → Define a rota `/api/projects/` com método POST.
2. **ProjectController.py** → Valida os dados recebidos e chama o repositório para criar o projeto.
3. **ProjectRepository.py** → Realiza a inserção do projeto no banco de dados.

---

## 📋 **Detalhes de Implementação:**

* Os campos `name` e `contractor` são obrigatórios; `date` é opcional.
* Caso `date` não seja informada, o sistema usa a data/hora atual automaticamente.
* A rota captura exceções caso o JSON enviado não contenha os campos necessários.
* Em caso de erro na criação do projeto no banco, é retornado erro 500.

---

## 💻 **Considerações Técnicas:**

* Não há autenticação configurada para esta rota (sugere-se implementar).
* O formato esperado para `date` é string, preferencialmente ISO 8601.
* O retorno inclui o ID gerado do projeto e os dados informados para confirmação.
