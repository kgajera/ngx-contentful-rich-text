// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ngx-contentful-rich-text',
  tagline: 'Angular Renderer for Contentful Rich Text',
  url: 'https://kgajera.github.io',
  baseUrl: '/ngx-contentful-rich-text/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kgajera', // Usually your GitHub org/user name.
  projectName: 'ngx-contentful-rich-text', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: false,
          editUrl:
            'https://github.com/kgajera/ngx-contentful-rich-text/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ngx-contentful-rich-text',
        logo: {
          alt: 'Logo',
          src: '/img/logo.png',
        },
        items: [
          {
            href: '/docs',
            label: 'Docs',
            position: 'right',
          },
          {
            href: 'https://github.com/kgajera/ngx-contentful-rich-text',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          alt: 'Logo',
          src: '/img/logo.png',
          height: 75,
          width: 75,
        },
        links: [
          {
            href: 'https://github.com/kgajera/ngx-contentful-rich-text',
            label: 'GitHub',
          },
        ],
        copyright: `Built by Kishan Gajera with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
