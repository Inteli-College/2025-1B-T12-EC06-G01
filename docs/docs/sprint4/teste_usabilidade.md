---
title: "Teste de Usabilidade"
sidebar_label: Teste de Usabilidade
---

Essa seção apresenta o planejamento do teste de usabilidade realizado durante a apresentação ao parceiro. 
O objetivo do teste foi avaliar a usabilidade da aplicação, verificando se o sistema atende, de forma eficiente,  intuitiva e satisfatória, às necessidades dos usuários finais. O foco está em observar como os usuários realmente utilizam o sistema, identificando barreiras, pontos de fricção, e melhorias na experiência de uso.

O teste foi estruturado em cenários de uso representativos que simulam possíveis situações futuras de uso, caso a aplicação venha a ser integrada à rotina de inspeções e análises de fissuras. Cada cenário está associado a requisitos funcionais e não funcionais previamente definidos, com o objetivo de validar se a aplicação cumpre suas funções esperadas na prática.

O teste foi realizado com um dos representantes do parceiro institucional do projeto, perfil que mais se aproxima do usuário final da aplicação — técnicos e pesquisadores com familiaridade em inspeções de fissuras. Por questões de tempo, foi possível avaliar apenas os cenários e subcenários dos grupos 1 e 3.

## Metodologia

- **Abordagem:** Testes presenciais moderados (com facilitador conduzindo o teste e anotando interações em tempo real)
- **Instrumento:** Roteiro com tarefas baseadas em cenários
- **Coleta:** Observação direta, anotação de comportamentos e comentários espontâneos e registro de respostas a perguntas qualitativas
- **Critérios de sucesso:** Capacidade de completar a tarefa, tempo de realização, nível de confiança, fluidez da navegação e compreensão da interface

## Estruturas dos Cenários:

Cada cenário foi construído com:

- **Pré-condições:** Estado do sistema e contexto inicial
- **Tarefa:** Instrução dada ao participante
- **Pós-condições:** Resultado esperado
- **Requisitos:** Requisitos funcionais e não funcionais associados
- **Perguntas qualitativas:** Para coleta de feedback após a tarefa

### Cenário 1.1 – Criação de novo projeto
- **Pré-condições:** Sistema aberto na tela inicial
- **Tarefa:** "Você chegou agora do campo e quer começar a organizar os dados. Primeiro, crie um novo projeto para essa nova inspeção."
- **Pós-condições:** Um novo projeto aparece listado no sistema
- **Requisitos:** RF10 (armazenamento estruturado)
- **Avaliação:** Testa a visibilidade do botão "Novo Projeto", compreensão dos campos obrigatórios e interpretação correta da data inserida

### Cenário 1.2 – Criação de prédio dentro do projeto
- **Pré-condições:** Projeto já criado e selecionado
- **Tarefa:** "Agora, crie um prédio que será inspecionado dentro desse projeto."
- **Pós-condições:** Prédio aparece vinculado ao projeto
- **Requisitos:** RF10
- **Avaliação:** Clareza da ação de adicionar prédio e vínculo visual com o projeto

### Cenário 1.3 – Criação de fachada
- **Pré-condições:** Prédio já criado e selecionado
- **Tarefa:** "Agora, crie a fachada do prédio onde você capturou as imagens."
- **Pós-condições:** Fachada aparece vinculada ao prédio correto
- **Requisitos:** RF10
- **Avaliação:** Clareza da hierarquia Projeto > Prédio > Fachada e compreensão da interface

### Cenário 1.4 – Upload das imagens
- **Pré-condições:** Fachada criada e visível
- **Tarefa:** "Envie as imagens capturadas em campo para essa fachada."
- **Pós-condições:** Imagens aparecem listadas na fachada correta
- **Requisitos:** RF01, RF03
- **Avaliação:** Visibilidade do botão de upload, clareza do processo e organização automática das imagens

### Cenário 1.5 – Classificação automática
- **Pré-condições:** Imagens já carregadas
- **Tarefa:** "Agora envie essas imagens para a classificação automática."
- **Pós-condições:** Imagens são marcadas com os tipos de fissura detectados
- **Requisitos:** RF02, RF11, RNF01, RNF02
- **Avaliação:** Clareza da ação, tempo de resposta e confiança no sistema

### Cenário 2.1 – Visualizar fachada e status das imagens
- **Pré-condições:** Projeto com fachada e imagens previamente carregadas (classificadas ou não)
- **Tarefa:** "Você está voltando ao sistema para revisar um projeto iniciado anteriormente. Acesse esse projeto, navegue até a fachada correspondente e veja se há imagens prontas para análise ou classificação."
- **Pós-condições:** Usuário navega até a fachada, visualiza status de cada imagem e entende o próximo passo
- **Requisitos:** RF03, RF10, RF11
- **Avaliação:** Facilidade de navegação, compreensão dos status e orientação para a próxima ação

### Cenário 2.2 – Classificar imagens pendentes
- **Pré-condições:** Imagens já carregadas, mas ainda não classificadas
- **Tarefa:** "Você já tinha enviado imagens dessa fachada em outro momento, mas ainda não classificou. Agora, envie essas imagens para classificação automática."
- **Pós-condições:** Sistema realiza a classificação com sucesso, exibindo tipos de fissura detectados
- **Requisitos:** RF02, RNF01, RNF02
- **Avaliação:** Continuidade do fluxo, clareza da tarefa e viabilidade em cenários com grande volume de imagens

### Cenário 3 – Geração de relatório
- **Pré-condições:** Fachadas já classificadas no sistema
- **Tarefa:** "Gere um relatório para exportar os dados dessa fachada para um laudo técnico."
- **Pós-condições:** Relatório exibido e baixado com informações completas
- **Requisitos:**  RF09, RNF06
- **Avaliação:** Completude e formato do relatório, facilidade de geração e aplicabilidade prática

## Resultados Observados

### Impressão geral
- A maioria das tarefas foi concluída com sucesso e o fluxo geral foi considerado lógico e bem estruturado.
- A hierarquia entre projeto, prédio e fachada foi bem compreendida.
- O participante demonstrou confiança no uso do sistema após os primeiros minutos de interação.
- Embora alguns botões e nomenclaturas tenham causado confusão inicial, os aspectos funcionais da aplicação foram bem recebidos.

### Principais problemas e melhorias sugeridas

**Cenário 1.1**
- **Problema:** A data não estava claramente especificada. O participante ficou em dúvida se era a data da foto ou a data de criação do projeto.
- **Solução sugerida:** Especificar que se trata da data de captura das imagens.

**Cenário 1.2**
- **Problema:** O botão "Adicionar pasta" gerou confusão.
- **Solução sugerida:** Alterar para "Adicionar prédio" e aumentar o tamanho do botão.

**Cenário 1.3**
- **Problema:** O botão "Adicionar pasta" também causou dúvida neste contexto.
- **Solução sugerida:** Alterar a nomenclatura para "Adicionar fachada".

**Cenário 1.5**
- **Problema:** O botão "Enviar" gerou incerteza quanto à ação executada.
- **Solução sugerida:** Trocar o texto do botão para "Classificar".

**Cenário 3**
- **Comentário positivo:** Relatório gerado agradou o participante, pois se assemelha aos usados em sua rotina.
- **Comentário adicional:** Já está sendo utilizado o formato JSON, o que permite futuras personalizações.

**Tempo de classificação**
- **Resultado:** O tempo de resposta foi considerado adequado e não gerou frustração.

**Interação geral**
- **Problema:** O botão "Enter" não funciona para executar a ação esperada.
- **Solução:** Implementar o comportamento padrão do Enter confirmar as ações em cada tela.

## Conclusão

O teste de usabilidade da aplicação FissFix confirmou que o sistema é funcional, intuitivo e eficaz na execução das tarefas principais. Apesar do bom desempenho geral, foram identificados pontos pontuais de melhoria relacionados à nomenclatura de botões, clareza de campos e pequenas interações. As sugestões levantadas durante o teste já foram priorizadas e serão aplicadas na próxima sprint de desenvolvimento.