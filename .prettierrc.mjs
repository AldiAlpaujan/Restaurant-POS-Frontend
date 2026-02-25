/**
 * @type {import("prettier").Config}
 * @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig}
 * @type {import("prettier-plugin-tailwindcss").PluginOptions}
 * */

const config = {
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: 'src/index.css',
  importOrder: [
    'dayjs',
    '^react$',
    '^next$',
    '^next/.*$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '^@lib/(.*)$',
    '^@lib/(.*)$',
    '^@lib/(.*)$',
    '^@docs/(.*)$',
    '^@/.*$',
    '^../(?!.*.css$).*$',
    '^./(?!.*.css$).*$',
    '\\.css$',
    '.*styles.css$',
  ],
  overrides: [
    {
      files: '*.mdx',
      options: {
        printWidth: 70,
      },
    },
  ],
};

export default config;
