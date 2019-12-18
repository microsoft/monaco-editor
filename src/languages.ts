import { IFeatureDefinition } from "./types";

const languagesArr: IFeatureDefinition[] = [
  {
    label: 'apex',
    entry: 'vs/basic-languages/apex/apex.contribution',
    worker: undefined,
  },
  {
    label: 'azcli',
    entry: 'vs/basic-languages/azcli/azcli.contribution',
    worker: undefined,
  },
  {
    label: 'bat',
    entry: 'vs/basic-languages/bat/bat.contribution',
    worker: undefined,
  },
  {
    label: 'clojure',
    entry: 'vs/basic-languages/clojure/clojure.contribution',
    worker: undefined,
  },
  {
    label: 'coffee',
    entry: 'vs/basic-languages/coffee/coffee.contribution',
    worker: undefined,
  },
  {
    label: 'cpp',
    entry: 'vs/basic-languages/cpp/cpp.contribution',
    worker: undefined,
  },
  {
    label: 'csharp',
    entry: 'vs/basic-languages/csharp/csharp.contribution',
    worker: undefined,
  },
  {
    label: 'csp',
    entry: 'vs/basic-languages/csp/csp.contribution',
    worker: undefined,
  },
  {
    label: 'css',
    entry: [
      'vs/basic-languages/css/css.contribution',
      'vs/language/css/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/css/cssWorker',
      entry: 'vs/language/css/css.worker',
    },
  },
  {
    label: 'dockerfile',
    entry: 'vs/basic-languages/dockerfile/dockerfile.contribution',
    worker: undefined,
  },
  {
    label: 'fsharp',
    entry: 'vs/basic-languages/fsharp/fsharp.contribution',
    worker: undefined,
  },
  {
    label: 'go',
    entry: 'vs/basic-languages/go/go.contribution',
    worker: undefined,
  },
  {
    label: 'graphql',
    entry: 'vs/basic-languages/graphql/graphql.contribution',
    worker: undefined,
  },
  {
    label: 'handlebars',
    entry: 'vs/basic-languages/handlebars/handlebars.contribution',
    worker: undefined,
  },
  {
    label: 'html',
    entry: [
      'vs/basic-languages/html/html.contribution',
      'vs/language/html/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/html/htmlWorker',
      entry: 'vs/language/html/html.worker',
    },
  },
  {
    label: 'ini',
    entry: 'vs/basic-languages/ini/ini.contribution',
    worker: undefined,
  },
  {
    label: 'java',
    entry: 'vs/basic-languages/java/java.contribution',
    worker: undefined,
  },
  {
    label: 'javascript',
    entry: 'vs/basic-languages/javascript/javascript.contribution',
    worker: undefined,
  },
  {
    label: 'json',
    entry: 'vs/language/json/monaco.contribution',
    worker: {
      id: 'vs/language/json/jsonWorker',
      entry: 'vs/language/json/json.worker',
    },
  },
  {
    label: 'less',
    entry: 'vs/basic-languages/less/less.contribution',
    worker: undefined,
  },
  {
    label: 'lua',
    entry: 'vs/basic-languages/lua/lua.contribution',
    worker: undefined,
  },
  {
    label: 'markdown',
    entry: 'vs/basic-languages/markdown/markdown.contribution',
    worker: undefined,
  },
  {
    label: 'msdax',
    entry: 'vs/basic-languages/msdax/msdax.contribution',
    worker: undefined,
  },
  {
    label: 'mysql',
    entry: 'vs/basic-languages/mysql/mysql.contribution',
    worker: undefined,
  },
  {
    label: 'objective',
    entry: 'vs/basic-languages/objective-c/objective-c.contribution',
    worker: undefined,
  },
  {
    label: 'perl',
    entry: 'vs/basic-languages/perl/perl.contribution',
    worker: undefined,
  },
  {
    label: 'pgsql',
    entry: 'vs/basic-languages/pgsql/pgsql.contribution',
    worker: undefined,
  },
  {
    label: 'php',
    entry: 'vs/basic-languages/php/php.contribution',
    worker: undefined,
  },
  {
    label: 'postiats',
    entry: 'vs/basic-languages/postiats/postiats.contribution',
    worker: undefined,
  },
  {
    label: 'powerquery',
    entry: 'vs/basic-languages/powerquery/powerquery.contribution',
    worker: undefined,
  },
  {
    label: 'powershell',
    entry: 'vs/basic-languages/powershell/powershell.contribution',
    worker: undefined,
  },
  {
    label: 'pug',
    entry: 'vs/basic-languages/pug/pug.contribution',
    worker: undefined,
  },
  {
    label: 'python',
    entry: 'vs/basic-languages/python/python.contribution',
    worker: undefined,
  },
  {
    label: 'r',
    entry: 'vs/basic-languages/r/r.contribution',
    worker: undefined,
  },
  {
    label: 'razor',
    entry: 'vs/basic-languages/razor/razor.contribution',
    worker: undefined,
  },
  {
    label: 'redis',
    entry: 'vs/basic-languages/redis/redis.contribution',
    worker: undefined,
  },
  {
    label: 'redshift',
    entry: 'vs/basic-languages/redshift/redshift.contribution',
    worker: undefined,
  },
  {
    label: 'ruby',
    entry: 'vs/basic-languages/ruby/ruby.contribution',
    worker: undefined,
  },
  {
    label: 'rust',
    entry: 'vs/basic-languages/rust/rust.contribution',
    worker: undefined,
  },
  {
    label: 'sb',
    entry: 'vs/basic-languages/sb/sb.contribution',
    worker: undefined,
  },
  {
    label: 'scheme',
    entry: 'vs/basic-languages/scheme/scheme.contribution',
    worker: undefined,
  },
  {
    label: 'scss',
    entry: 'vs/basic-languages/scss/scss.contribution',
    worker: undefined,
  },
  {
    label: 'shell',
    entry: 'vs/basic-languages/shell/shell.contribution',
    worker: undefined,
  },
  {
    label: 'solidity',
    entry: 'vs/basic-languages/solidity/solidity.contribution',
    worker: undefined,
  },
  {
    label: 'sql',
    entry: 'vs/basic-languages/sql/sql.contribution',
    worker: undefined,
  },
  {
    label: 'st',
    entry: 'vs/basic-languages/st/st.contribution',
    worker: undefined,
  },
  {
    label: 'swift',
    entry: 'vs/basic-languages/swift/swift.contribution',
    worker: undefined,
  },
  {
    label: 'typescript',
    entry: [
      'vs/basic-languages/typescript/typescript.contribution',
      'vs/language/typescript/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/typescript/tsWorker',
      entry: 'vs/language/typescript/ts.worker',
    },
  },
  {
    label: 'vb',
    entry: 'vs/basic-languages/vb/vb.contribution',
    worker: undefined,
  },
  {
    label: 'xml',
    entry: 'vs/basic-languages/xml/xml.contribution',
    worker: undefined,
  },
  {
    label: 'yaml',
    entry: 'vs/basic-languages/yaml/yaml.contribution',
    worker: undefined,
  },
];

export const languagesById: { [language: string]: IFeatureDefinition; } = {};
languagesArr.forEach(language => languagesById[language.label] = language);
