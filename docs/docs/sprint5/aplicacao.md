---
title: "Aplicação final"
sidebar_label: Aplicação final
sidebar_position: 4
---

# Frontend — Versão Final

## Escopo da Entrega — Interface Conectada ao Sistema Completo

Esta entrega marca a versão final da interface ReactJS do sistema de análise de fissuras. Todas as principais funcionalidades estão conectadas ao backend e ao banco de dados, permitindo o uso contínuo por técnicos, engenheiros e parceiros do projeto. A interface cobre desde a criação de projetos até a visualização e classificação automática de imagens, consolidando a jornada do usuário final.

---

## Funcionalidades Entregues

- Tela inicial com listagem de projetos e botão para criação;
- Criação de novos prédios e fachadas vinculadas a projetos;
- Upload de imagens por fachada com visualização individual;
- Botão de envio/classificação de imagem via modelo IA;
- Tela de resultados por imagem com veredito e confiança;
- Geração de relatório por fachada com download de PDF;
- Feedback visual e modais de confirmação em tarefas críticas;
- Navegação fluida por meio da sidebar fixa.


---

## Alterações Importantes na Interface

- **Refatoração para responsividade parcial**: Durante a Sprint final, o sistema recebeu ajustes visuais e estruturais para adaptar melhor a interface a dispositivos com resoluções menores, como tablets. Ainda não se trata de uma responsividade total para smartphones, mas os principais componentes foram testados e otimizados para garantir uma navegação fluida em telas médias.

- **Remoção do botão de pincel na navbar**: por questão de priorização de entregas e tempo de implementação, o botão de edição visual (ícone de pincel) foi removido da versão final. No entanto, sua implementação parcial pode ser consultada na branch `feat/pincel`.

- **Renomeação de botões**: Com base nos feedbacks de testes com o parceiro, os botões foram ajustados para refletir melhor a hierarquia do sistema, como "Adicionar Prédio" e "Adicionar Fachada".

---

## Demonstração em Vídeo

A seguir, o fluxo completo do sistema pode ser conferido por meio do vídeo gravado durante a Sprint final. Além dele, pequenos vídeos individuais acompanham cada funcionalidade:


<div align='center'>
<iframe width="560" height="315" src="https://www.youtube.com/embed/YCsivhz-eW4?si=NmzbnUFossIKu8j-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>



## Considerações Finais
A interface do sistema atingiu um nível de maturidade suficiente para ser utilizada em campo. Ela cobre todos os fluxos principais — da criação ao resultado — com estrutura modular, integração completa com o backend e organização visual clara. A priorização durante a Sprint permitiu entregar um sistema coeso e funcional, pronto para avaliação de parceiros e novos ciclos de melhorias.

