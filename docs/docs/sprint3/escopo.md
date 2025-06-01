---
title: Escopo da Sprint
sidebar_position: 7
---

## Objetivo da Sprint
O objetivo principal da sprint é entregar, de maneira funcional, o fluxo geral do sistema, assim como refinar o modelo por meio de testes com novos hiperparâmetros e com novos modelos. No mais, é parte do escopo da sprint incorporar ao projeto os feedbacks dados na review da sprint anterior. 

### Mudança de escopo
O principal ponto de melhoria apontado pelo parceiro de projeto foi que, da forma como a nossa plataforma estava pensada e inicialmente criada, não era possível separar as imagens por fachadas e nem por prédios, ou seja, ao criar um projeto o usuário já tinha que subir as imagens, sem poder separá-las de nenhuma forma. No mais, da forma como a plataforma estava estruturada, considerávamos que cada projeto cadastrado teria só um prédio, o que foi apontado pelo parceiro como um erro, visto que um projeto pode incluir a avaliação de vários prédios.

Assim, nessa sprint passamos a considerar um novo fluxo, no qual a criação de um projeto pede apenas nome, cotratante e data, e após a criação dele o usuário tem acesso a uma tela na qual consegue ver os prédios daquele projeto ou adicionar novos prédios - ao contrário da versão anterior, na qual a  criação de um proejto exigia o upload das imagens e a tela seguinte já era uma visualização dessas imagens. No mais, na nova versão, dentro da pasta de cada prédio é possível criar pastas de fachadas, incorporando, assim, o que foi solictado.

Essa mudança de escopo nos trouxe agumas tarefas (como, por exemplo, a remodelagem do banco de dados, a criação de novas telas e a refatoração do menu de criação de projeto), as quais foram incorporadas ao backlog da sprint.

---

## Escopo definido para a Sprint

O escopo desta sprint concentrou-se no desenvolvimento e integração de todo o fluxo principal do sistema. 

A seguir, destacamos os principais entregáveis definidos para esta sprint:

### Funcionalidades incluídas no escopo:

- [x] Refatoração do popup de criação de projeto;
- [x] Implementação das telas de: 
    - [x] visualização de projeto;
    - [x] visualização de prédios;
    - [x] visualização de fachadas;
    - [x] visualização das imagens por fachada;
    - [x] Resultado do modelo;
- [x] Desenvolvimento das rotas GET para:
    - [x] Usuários;
    - [x] Projetos;
    - [x] Prédios;
    - [x] Fachadas;
    - [x] Imagens por fachada;
    - [x] Filtros (para visualização de imagens específicas) -> a ser integrada posteriormente;
    - [x] Logs;
    - [x] Imagens classificadas;
- [x] Integração das rotas GET com o front;

- [x] Teste de novos hiperparâmetros para o Yolo;
- [x] Treinamento do Unet e do Tenserflow como alternativas de modelo;
- [x] Remodelar o banco de acordo com o novo escopo;

### Proposta de Valor da Entrega
Com essa entrega, o usuário passa a poder, de maneira geral, utilizar o sistema para sua necessidade principal: a classificação das imagens. Ainda que demais funcionalidades (como, por exemplo, auditoria humana) estejam em desenvolvimento e não possam ser acessados, o usuário já consegue utilizar o sistema para sua funcionalidade principal.