---
title: frontend
sidebar_position: 7
---

# Frontend 

## Escopo da Entrega — Frontend do Sistema Principal

Durante a Sprint 2, foi implementada a primeira versão funcional da interface do sistema utilizando ReactJS. Esta interface é responsável por permitir a interação do usuário com os módulos de upload e exibição de imagens do sistema.

Esta parte da entrega contempla o desenvolvimento da camada de **frontend da aplicação principal**, conectando-se futuramente aos módulos de backend.

---

### Decisões Arquiteturais

- **Framework base:** Create React App (CRA), pela facilidade de uso e suporte a boas práticas.
- **Divisão modular:** Separação clara entre componentes reutilizáveis (`components/`) e páginas (`pages/`), garantindo escalabilidade.
- **Componente de Navegação:** Implementação de uma barra lateral fixa (`Sidebar`) com ícones de navegação e ações principais.
- **Upload estruturado:** A função de envio de imagens foi implementada, com suporte a múltiplas imagens e cards individuais (`CardImg`). A princípio, ele foi implementado apenas no frontend, e será futuramente conectado com o back e o banco de dados.
- **Estilização:** CSS modularizado por componente para facilitar manutenção.
- **Preparação para backend:** O frontend está estruturado para se integrar com APIs REST nas próximas sprints.

---

### Instruções de Uso

#### 1. Instalação de dependências

```bash
npm install
```

#### 2. Execução local

```bash
npm start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

### Funcionalidades Entregues

- Navegação lateral com ícones e rotas internas.
- Tela inicial com exibição de cards de imagem.
- Upload de imagens com pré-visualização.
- Interface responsiva (ainda que não adaptável para mobile) com base em flexbox.

---

### Proposta de Valor

Essa interface é fundamental para a proposta de valor do sistema, pois:

- Proporciona uma experiência de uso simples e intuitiva para operadores técnicos e engenheiros.
- Permite o gerenciamento visual das imagens.
- Facilita a apresentação inicial do sistema para parceiros e usuários finais com uma estrutura visual já funcional.

---

### Considerações Finais

A versão do frontend entregue nessa sprint, ainda que inicial, já permite ao perceiro ter uma ideia visual de como vai ser o sistema, e já o permite algumas interações essenciais para a versão final (como é o caso do upload de imagens). O código foi desenvolvido pensando na componentização, escalabilidade e futuras conexões com o backend.