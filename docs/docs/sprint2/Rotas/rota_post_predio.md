---
title: Rota de Criação de Prédio
sidebar_position: 4
---

# Rota de Criação de Prédio

Essa rota permite a criação de um novo prédio associado a um projeto existente no sistema. A funcionalidade é importante para registrar os prédios vinculados aos projetos, incluindo localização geográfica quando disponível.

## **Endpoint:** `/building/`

### **Método:** `POST`

## 🔹 **Body Params:**

| Parâmetro    | Tipo    | Obrigatório | Descrição                                     |
| ------------ | ------- | ----------- | --------------------------------------------- |
| `project_id` | integer | Sim         | ID do projeto ao qual o prédio está vinculado |
| `predio`     | string  | Sim         | Nome ou identificação do prédio               |
| `latitude`   | float   | Não         | Latitude do prédio (opcional)                 |
| `longitude`  | float   | Não         | Longitude do prédio (opcional)                |

---

## 🔹 **Exemplo de Requisição:**

```bash
curl -X POST "http://localhost:5000/building/" \
     -H "Content-Type: application/json" \
     -d '{
           "project_id": 12,
           "predio": "Bloco A",
           "latitude": -23.561684,
           "longitude": -46.655981
         }'
```

---

## 🔹 **Exemplo de Resposta:**

```json
{
  "id": 7,
  "projeto_id": 12,
  "predio": "Bloco A",
  "latitude": -23.561,
  "longitude": -46.655
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
  "message": "'project_id'"
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

1. **BuildingRoute.py** → Define a rota `/building/` com método POST.
2. **BuildingController.py** → Valida dados recebidos e chama o repositório para criação do prédio.
3. **BuildingRepository.py** → Executa a inserção do prédio no banco de dados.

---

## 📋 **Detalhes de Implementação:**

* Os campos `project_id` e `predio` são obrigatórios.
* `latitude` e `longitude` são opcionais; podem ser omitidos ou nulos.
* A rota captura exceções para campos faltantes no JSON.
* Em erro de banco, retorna código 500.

---

## 💻 **Considerações Técnicas:**

* Não há autenticação implementada na rota (recomenda-se adicionar).
* `latitude` e `longitude` são do tipo float, mas aceitam null.
* O retorno confirma a criação com os dados informados e o ID gerado.
