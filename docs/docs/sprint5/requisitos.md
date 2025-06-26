---
title: Validação dos Requisitos
sidebar_label: Validação dos Requisitos
sidebar_position: 1
---

Após o ciclo completo de desenvolvimento, todos os requisitos previamente definidos foram avaliados quanto à sua implementação, desempenho e aderência às necessidades reais dos usuários. A seguir, apresentamos uma análise final de cada requisito, indicando se foi atendido, parcialmente atendido ou não atendido, além de justificativas para os casos não implementados.

### Requisitos Funcionais

| Código | Descrição | Status | Observações |
|--------|-----------|--------|-------------|
| RF 01 | Upload de Imagens | ✅ Atendido | Funcionalidade implementada e validada no frontend. |
| RF 02 | Classificação Automática | ✅ Atendido | Modelo de IA treinado e integrado com sucesso ao backend. |
| RF 03 | Visualização de Imagens | ✅ Atendido | Imagens são exibidas na interface. |
| RF 04 | Correção Manual da Classificação | ⚠️ Parcialmente atendido | Correção da classificação técnica é possível pelo frontend mas a possibilidade de edição não foi implementada. |
| RF 05 | Processamento por Ordem de Captura | ❌ Não atendido | A ordenação com base no plano de voo não foi priorizada na versão atual. |
| RF 06 | Armazenamento de Geolocalização | ❌ Não atendido | Informações de GPS não estavam disponíveis nas imagens fornecidas. |
| RF 07 | Ordenação por Geolocalização | ❌ Não atendido | Dependente da RF 06; funcionalidade não foi viável nesta versão. |
| RF 08 | Agrupamento por Sequência de Captura | ❌ Não atendido | A lógica para identificar automaticamente sequência de captura não foi implementada. |
| RF 09 | Histórico de Análises | ✅ Atendido | Relatórios consolidados com data, projeto e resultado da classificação podem ser gerados. |
| RF 10 | Armazenamento Estruturado | ✅ Atendido | Banco relacional estruturado com tabelas para projetos, fachadas e imagens. |
| RF 11 | Visualização via Frontend | ✅ Atendido | Frontend React integrado e funcional localmente. |

---

### Requisitos Não Funcionais

| Código | Descrição | Status | Observações |
|--------|-----------|--------|-------------|
| RNF 01 | Precisão ≥ 90% | ✅ Atendido | Modelo atingiu 100% na base atual. |
| RNF 02 | Inferência < 10s | ✅ Atendido | Tempo médio de inferência em torno de 1s por imagem. |
| RNF 03 | Falsos Positivos < 10% | ✅ Atendido | Avaliações manuais mostraram precisão elevada e poucos falsos positivos. |
| RNF 04 | Falsos Negativos < 15% | ✅ Atendido | Resultados consistentes em diferentes conjuntos de teste. |
| RNF 05 | Comunicação Segura via HTTPS | ❌ Não atendido | Sistema rodou apenas localmente em ambiente de desenvolvimento. |
| RNF 06 | 100% de imagens armazenadas | ✅ Atendido | Testes confirmaram que todas as imagens capturadas foram armazenadas com sucesso. |
| RNF 07 | Notificação de erros | ⚠️ Parcialmente atendido | Logs de erro são gerados no backend, mas não há alerta visual no frontend. |
| RNF 08 | Padronização do pré-processamento | ✅ Atendido | Todas as imagens passaram pelos mesmos passos definidos no pipeline. |

---

### Conclusão

Apesar de algumas limitações pontuais, os principais requisitos críticos para o funcionamento do sistema foram atendidos com sucesso. A aplicação final entrega valor ao usuário, permitindo o upload, visualização e classificação de imagens com desempenho satisfatório. As funcionalidades não implementadas foram mapeadas e poderão compor o backlog de versões futuras do projeto, especialmente em contextos de produção real.