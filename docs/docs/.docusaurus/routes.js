import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug', 'f71'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/config',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/config', '92a'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/content',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/content', 'f67'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/globalData',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/globalData', 'af7'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/metadata',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/metadata', 'b28'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/registry',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/registry', 'b36'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/__docusaurus/debug/routes',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/__docusaurus/debug/routes', 'c5a'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/markdown-page',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/markdown-page', '00c'),
    exact: true
  },
  {
    path: '/2025-1B-T12-EC06-G01/docs',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/docs', '67e'),
    routes: [
      {
        path: '/2025-1B-T12-EC06-G01/docs',
        component: ComponentCreator('/2025-1B-T12-EC06-G01/docs', 'edc'),
        routes: [
          {
            path: '/2025-1B-T12-EC06-G01/docs',
            component: ComponentCreator('/2025-1B-T12-EC06-G01/docs', 'e31'),
            routes: [
              {
                path: '/2025-1B-T12-EC06-G01/docs/category/tutorial---basics',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/category/tutorial---basics', 'a51'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/category/tutorial---extras',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/category/tutorial---extras', '279'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/intro',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/intro', '6fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/congratulations', '32e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-blog-post', '52d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-document', '60a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/create-a-page', '27e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/deploy-your-site', 'af9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-basics/markdown-features', '7fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-extras/manage-docs-versions', '899'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/2025-1B-T12-EC06-G01/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/2025-1B-T12-EC06-G01/docs/tutorial-extras/translate-your-site', '800'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/2025-1B-T12-EC06-G01/',
    component: ComponentCreator('/2025-1B-T12-EC06-G01/', '795'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
