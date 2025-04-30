---
title: Requisitos 
sidebar_position: 2
---
# Requisitos do Sistema

&nbsp;Ao desenvolver um sistema, a etapa de definição dos requisitos é essencial para garantir o sucesso do projeto. Os requisitos descrevem tudo o que o sistema deve fazer e como ele deve funcionar, levando em consideração suas restrições e atributos de qualidade. Eles servem como base para o desenvolvimento das fases seguintes do projeto, como arquitetura e implementação, facilitando o entendimento das funcionalidades que devem ser priorizadas.

&nbsp;A principal função dos requisitos é garantir que a solução atenda às necessidades dos stakeholders e usuários. Sem uma definição bem estruturada, o projeto corre o risco de desviar de seus objetivos principais, além de gerar custos desnecessários, atrasar prazos para, ao final, acabar entregando um produto que não agrega valor real.

&nbsp;Antes de listar todas as funcionalidades e atributos técnicos, é importante realizar uma análise de negócios. Compreender com profundidade e clareza os objetivos do projeto e o seu valor que ele oferece é indispensável para garantir que a solução está resolvendo um problema real e relevante.

&nbsp;Além disso, identificar com precisão quem são os usuários do sistema e entender suas dores, desejos e necessidades é essencial para realizar uma definição assertiva dos requisitos. A criação de personas e user stories que refletem a realidade dos usuários, guia o desenvolvimento de um sistema mais adequado à quem irá utilizar, agregando valor e sentido ao projeto.

&nbsp;Por conta disso, antes da elaboração dos requisitos do sistema desenvolvido em parceria com o IPT, foram realizadas a análise de negócios e a compreensão aprofundada do cliente e dos usuários, cujos detalhes podem ser encontrados nas seções anteriores desta documentação.

&nbsp;Portanto, pode-se perceber que definição consciente de requisitos é o que torna possível elaborar escopos de projetos bem fundamentados e construir soluções relevantes e eficientes, alinhadas às necessidades e desejos do usuário. Para uma elaboração completa e compreensível, os requisitos são divididos em duas categorias: requisitos funcionais e requisitos não funcionais.


### Requisitos Funcionais:



Requisitos funcionais:


### Requisitos Não Funcionais

Os Requisitos Não Funcionais (RNFs) definem critérios de qualidade que o sistema deve atender, mesmo que não estejam diretamente ligados ao comportamento funcional ou às funcionalidades principais. Eles abrangem aspectos como desempenho, segurança, confiabilidade, usabilidade e integridade de dados.

Em um projeto como este — que envolve captura e análise de imagens por drones, uso de modelos de Machine Learning para detecção de fissuras e integração entre diferentes módulos do sistema — os RNFs são fundamentais para garantir:

- **Precisão e eficiência do modelo de IA**, assegurando que as detecções sejam confiáveis;
- **Desempenho adequado**, especialmente em relação ao tempo de inferência e resposta do sistema;
- **Segurança na comunicação entre componentes**, protegendo dados sensíveis e operacionais;
- **Confiabilidade no armazenamento das imagens capturadas**, evitando perdas críticas;
- **Tratamento robusto de erros e consistência no processamento**, garantindo a padronização das análises.

O cumprimento dos requisitos não funcionais é essencial para a qualidade global do sistema, a confiança dos usuários e a viabilidade do uso da solução em ambientes reais de inspeção e monitoramento.


#### RNF 01 - Precisão na detecção do modelo  
O módulo de Machine Learning deve atingir uma precisão mínima de 90% na classificação das imagens de fissuras nos dois tipos definidos, considerando uma base de dados de teste não vista durante o treinamento.

**Teste da precisão na detecção**  
Utilizar um conjunto de teste com ao menos 100 imagens captadas pelo drone. Avaliar o modelo com esse conjunto e confirmar que pelo menos 90% das imagens foram classificadas corretamente quanto à presença ou ausência de fissura.

---

#### RNF 02 - Tempo máximo de inferência  
O modelo de Machine Learning deve realizar a inferência (processo de identificação de fissuras) em menos de 10 segundos.

**Teste do tempo de inferência**  
Executar a inferência de detecção de fissura em 100 imagens de teste. Medir o tempo individual de inferência para cada imagem utilizando funções de temporização do sistema e confirmar que **nenhuma imagem ultrapassa 10 segundos**.

---

#### RNF 03 - Limite de falsos positivos  
O modelo de Machine Learning deve manter a taxa de falsos positivos inferior a 10%.

**Teste da taxa de falsos positivos**  
Utilizar o mesmo conjunto de teste validado manualmente. Contabilizar os falsos positivos (detecções incorretas de fissura onde não havia). Calcular a taxa de falsos positivos e garantir que seja inferior a 10%.

---

#### RNF 04 - Limite de falsos negativos  
O modelo de Machine Learning deve manter a taxa de falsos negativos inferior a 15%.

**Teste da taxa de falsos negativos**  
Utilizar o conjunto de teste validado manualmente. Contabilizar os falsos negativos (falhas em detectar fissuras reais). Calcular a taxa de falsos negativos e garantir que seja inferior a 15%.

---

#### RNF 05 - Comunicação segura entre módulos  
As comunicações HTTP entre frontend, WebAPI1 e WebAPI2 devem ser protegidas via HTTPS (em ambiente de produção).

**Teste de segurança nas comunicações**  
Executar o sistema em ambiente de produção e inspecionar as requisições HTTP realizadas. Verificar, via ferramenta de monitoramento de rede (ex: Fiddler, Wireshark, DevTools), se todas as requisições são realizadas via HTTPS, e que não há falhas de certificado SSL/TLS.

---

#### RNF 06 - Armazenamento completo das imagens  
O sistema deve garantir que 100% das imagens capturadas pelo drone sejam armazenadas no banco de dados sem perda de dados.

**Teste de integridade no armazenamento de imagens**  
Simular um voo com captura de N imagens. Após a operação, acessar diretamente o banco de dados e verificar se todas as N imagens estão armazenadas com consistência e integridade (sem corrupção, truncamento ou perdas).

---

#### RNF 07 - Notificação de erros do sistema  
O sistema deve ter notificações em casos de erros.

**Teste de notificações de erro**  
Forçar falhas controladas no sistema (ex: perda de conexão, erro de gravação no banco, erro de processamento de imagem). Verificar se o sistema gera notificações apropriadas (logs, alertas visuais ou e-mails, conforme especificado) imediatamente após cada falha.

---

#### RNF 08 - Padronização do pré-processamento  
O sistema deve corretamente realizar o mesmo pré-processamento para todas as imagens.

**Teste de consistência no pré-processamento**  
Enviar múltiplas imagens de diferentes fontes (drones distintos, horários variados) e verificar se todas passam exatamente pelos mesmos passos de pré-processamento (ex: redimensionamento, normalização, filtragem), com base nos logs do sistema ou outputs intermediários.
