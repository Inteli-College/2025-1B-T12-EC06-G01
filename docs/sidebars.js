// sidebars.js

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Sprint 1', // Sobrescrito por docs/sprint1/_category_.json se existir
      link: {
        type: 'generated-index',
      },
      items: [
        {
          type: 'category',
          label: 'Entendimento do Metadesign', // Ajustado para o nome correto da pasta
          // Se tiver _category_.json em 'Entendimento do metadesign', este label pode ser omitido.
          items: [
            {
              type: 'category',
              label: 'Personas', // Se tiver _category_.json em 'personas', este label pode ser omitido.
              items: [
                'sprint1/Entendimento do metadesign/personas/Carlos', // Caminho corrigido
                'sprint1/Entendimento do metadesign/personas/Eduardo', // Caminho corrigido
                'sprint1/Entendimento do metadesign/personas/intro', // 'intro.md' movido para cá
              ],
            },
            {
              type: 'category',
              label: 'User Stories', // Se tiver _category_.json em 'User Stories', este label pode ser omitido.
              items: [
                'sprint1/Entendimento do metadesign/User Stories/Carlos', // Caminho corrigido
                'sprint1/Entendimento do metadesign/User Stories/Eduardo', // Caminho corrigido
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Entendimento do Negócio',
          items: [
            'sprint1/Entendimento do Negócio/Business Model Canva',
            'sprint1/Entendimento do Negócio/Matriz de Risco',
          ],
        },
        'sprint1/arquitetura-da-informacao', // Nome do arquivo corrigido
        'sprint1/arquitetura',
        'sprint1/Requisitos',
      ],
    },
    {
      type: 'category',
      label: 'Sprint 2', // Sobrescrito por docs/sprint2/_category_.json se existir
      link: {
        type: 'generated-index',
      },
      items: [
        'sprint2/escopo',
        {
          type: 'category',
          label: 'Design', // Sobrescrito por docs/sprint2/Design/_category_.json se existir
          link: {
            type: 'generated-index',
          },
          items: [
            'sprint2/Design/Esboço protótipo de alta fidelidade', // Nome do arquivo corrigido
            'sprint2/Design/Guia de estilos',
            'sprint2/Design/Prototipo de baixa fidelidade', // Nome do arquivo corrigido (e sem acento)
            'sprint2/Design/User flow',
          ],
        },
        'sprint2/frontend',
        'sprint2/banco da dados',
        'sprint2/modelo',
        {
          type: 'category',
          label: 'Rotas',
          link: {
             type: 'generated-index',
          },
          items: [
            'sprint2/Rotas/rota_classificacao',
            'sprint2/Rotas/rota_deleta_image', // Nome do arquivo corrigido
            'sprint2/Rotas/rota_filtro',
            'sprint2/Rotas/rota_post_predio',
            'sprint2/Rotas/rota_post_projeto',
            'sprint2/Rotas/rota_update_projeto',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Sprint 3',
      link: { type: 'generated-index' }, // Cria uma página de índice para a Sprint 3
      items: [
        'sprint3/escopo',      // Referencia 'escopo.md'
        {
          type: 'category',
          label: 'Frontend', // Corresponde à pasta Frontend
          link: {
            type: 'generated-index', // Opcional: cria um índice para o Frontend
          },
          items: [
            'sprint3/Frontend/frontend', // Referencia 'frontend.md' dentro de Frontend
          ],
        },
        {
          type: 'category',
          label: 'Modelos', // Corresponde à pasta Modelos
          link: {
            type: 'generated-index', // Opcional: cria um índice para Modelos
          },
          items: [
            'sprint3/Modelos/Yolo', // Referencia 'Yolo.md' dentro de Modelos
            'sprint3/Modelos/Unet', // Referencia 'Unet.md' dentro de Modelos
          ],
        },
        'sprint3/database',    // Referencia 'database.md'
        'sprint3/rotas',       // Referencia 'rotas.md'
      ],
    },
    {
      type: 'category',
      label: 'Sprint 4',
      link: { type: 'generated-index' },
      items: [
        // Se você tem 'sprint4/intro' conforme "Available document ids", adicione-o:
        'sprint4/Guia de execução do sistema',
        'sprint4/analise_financeira'

        // Adicione outros documentos da Sprint 4 aqui
      ],
    },
    // Se houver uma Sprint 5, adicione-a também:
    // {
    //   type: 'category',
    //   label: 'Sprint 5',
    //   link: { type: 'generated-index' },
    //   items: [
    //     'sprint5/intro', // Conforme "Available document ids"
    //     // Adicione outros documentos da Sprint 5 aqui
    //   ],
    // },
    // O arquivo 'intro' que aparece sozinho na lista de "Available document ids"
    // pode ser um arquivo na raiz do seu diretório 'docs'.
    // Se quiser adicioná-lo à sidebar, pode ser assim:
    // 'intro', // Se ele estiver em docs/intro.md
  ],
};

module.exports = sidebars;