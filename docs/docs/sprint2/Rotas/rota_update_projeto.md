---
title: Rota de Atualização de Nome de Projeto
sidebar_position: 6
---

# Rota de Atualização de Nome de Projeto

Essa rota foi desenvolvida para permitir a atualização do nome de projetos existentes no sistema. A funcionalidade é essencial para manter os metadados dos projetos atualizados conforme as necessidades dos usuários e do andamento dos trabalhos.

## **Endpoint:** `/api/projects/<int:project_id>/name`

### **Método:** `PUT`

## 🔹 **Path Params:**

| Parâmetro   | Tipo    | Obrigatório | Descrição                                |
|--------------|---------|-------------|----------------------------------------|
| `project_id`   | integer | Sim         | ID do projeto que terá o nome atualizado |

## 🔹 **Body Params:**

| Parâmetro   | Tipo    | Obrigatório | Descrição                                |
|--------------|---------|-------------|----------------------------------------|
| `name`       | string  | Sim         | Novo nome para o projeto                |

---

## 🔹 **Exemplo de Requisição:**

```bash
curl -X PUT "http://localhost:5000/api/projects/5/name" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Inspeção Estrutural - Edifício Aurora"
         }'
```

---

## 🔹 **Exemplo de Resposta:**

```json
{
  "code": 200,
  "message": "Project name updated successfully",
  "project": {
    "id": 5,
    "name": "Inspeção Estrutural - Edifício Aurora"
  }
}
```

---

## 🔹 **Possíveis Erros:**

| Código | Descrição                        |
|---------|--------------------------------|
| `400`   | ID do projeto é obrigatório    |
| `400`   | Novo nome do projeto é obrigatório |
| `400`   | Novo nome do projeto não pode estar vazio |
| `404`   | Projeto não encontrado         |
| `500`   | Erro interno do servidor       |

```json
{
  "code": 400,
  "message": "New project name is required"
}
```

```json
{
  "code": 404,
  "message": "Project with ID 5 not found"
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

1. **ProjectRoutes.py** → Define a rota `/api/projects/<int:project_id>/name`.
2. **ProjectController.py** → Valida os parâmetros de entrada e gerencia a operação de atualização.
3. **ProjectRepository.py** → Executa a atualização do nome do projeto no banco de dados.

---

## 📋 **Detalhes de Implementação:**

- A operação atualiza apenas o campo `name` da tabela de projetos.
- O sistema valida que o novo nome não esteja vazio ou contenha apenas espaços.
- A atualização é transacional - se ocorrer algum erro, as alterações são revertidas.
- O sistema registra logs detalhados do processo para fins de auditoria.

---

## 💻 **Considerações Técnicas:**

- A rota requer autenticação e autorização apropriadas que devem ser implementadas no middleware.
- Para garantir consistência, o sistema não permite a alteração do nome para um valor idêntico ao atual.
- Esta operação é isolada e não afeta outras propriedades do projeto ou imagens relacionadas.
