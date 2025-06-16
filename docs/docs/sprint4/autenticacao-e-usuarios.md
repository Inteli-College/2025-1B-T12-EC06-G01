---
sidebar_label: 'Autenticação e Usuários'
title: 'API de Autenticação e Usuários'
---

# API de Autenticação e Usuários

Estes endpoints são responsáveis pelo gerenciamento de usuários, incluindo o processo de cadastro e a autenticação via JSON Web Tokens (JWT).

:::note Status da Integração

Atenção: Os endpoints de cadastro (`/register`) e login (`/login`) descritos neste documento estão implementados e funcionais no backend, mas **ainda não foram integrados com as telas do frontend**.

:::

## Como Usar o Token JWT

Após um login bem-sucedido, a API retorna um token de acesso. Para todas as requisições a rotas protegidas, este token deve ser incluído no cabeçalho `Authorization`.

**Formato do Cabeçalho:**
`Authorization: Bearer <token_jwt_aqui>`

---

## Cadastro de Usuário

Cria um novo usuário no sistema.

`POST /users/register`

### Corpo da Requisição (Body)

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senhaForte123"
}
```

### Resposta de Sucesso (201 Created)

```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com"
}
```

### Respostas de Erro

* **409 Conflict:** O email fornecido já está em uso.
* **400 Bad Request:** Faltou algum campo obrigatório no corpo da requisição.

---

## Login de Usuário

Autentica um usuário existente e retorna um token de acesso JWT.

`POST /users/login`

### Corpo da Requisição (Body)

```json
{
  "email": "usuario@exemplo.com",
  "password": "senhaForte123"
}
```

### Resposta de Sucesso (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMz..."
}
```

### Respostas de Erro

* **401 Unauthorized:** Email ou senha incorretos.