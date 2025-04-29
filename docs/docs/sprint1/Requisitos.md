Introducao dos requisitos:



Requisitos funcionais:


### Requisitos Não Funcionais

---

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
