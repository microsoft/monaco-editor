module.exports = {
  apex: {
    entry: 'vs/basic-languages/apex/apex.contribution',
    worker: undefined,
  },
  azcli: {
    entry: 'vs/basic-languages/azcli/azcli.contribution',
    worker: undefined,
  },
  bat: {
    entry: 'vs/basic-languages/bat/bat.contribution',
    worker: undefined,
  },
  clojure: {
    entry: 'vs/basic-languages/clojure/clojure.contribution',
    worker: undefined,
  },
  coffee: {
    entry: 'vs/basic-languages/coffee/coffee.contribution',
    worker: undefined,
  },
  cpp: {
    entry: 'vs/basic-languages/cpp/cpp.contribution',
    worker: undefined,
  },
  csharp: {
    entry: 'vs/basic-languages/csharp/csharp.contribution',
    worker: undefined,
  },
  csp: {
    entry: 'vs/basic-languages/csp/csp.contribution',
    worker: undefined,
  },
  css: {
    entry: [
      'vs/basic-languages/css/css.contribution',
      'vs/language/css/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/css/cssWorker',
      entry: 'vs/language/css/css.worker',
      output: 'css.worker.js',
      fallback: 'vs/language/css/cssWorker',
    },
  },
  dockerfile: {
    entry: 'vs/basic-languages/dockerfile/dockerfile.contribution',
    worker: undefined,
  },
  fsharp: {
    entry: 'vs/basic-languages/fsharp/fsharp.contribution',
    worker: undefined,
  },
  go: {
    entry: 'vs/basic-languages/go/go.contribution',
    worker: undefined,
  },
  graphql: {
    entry: 'vs/basic-languages/graphql/graphql.contribution',
    worker: undefined,
  },
  handlebars: {
    entry: 'vs/basic-languages/handlebars/handlebars.contribution',
    worker: undefined,
  },
  html: {
    entry: [
      'vs/basic-languages/html/html.contribution',
      'vs/language/html/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/html/htmlWorker',
      entry: 'vs/language/html/html.worker',
      output: 'html.worker.js',
      fallback: 'vs/language/html/htmlWorker',
    },
  },
  ini: {
    entry: 'vs/basic-languages/ini/ini.contribution',
    worker: undefined,
  },
  java: {
    entry: 'vs/basic-languages/java/java.contribution',
    worker: undefined,
  },
  javascript: {
    entry: 'vs/basic-languages/javascript/javascript.contribution',
    worker: undefined,
  },
  json: {
    entry: 'vs/language/json/monaco.contribution',
    worker: {
      id: 'vs/language/json/jsonWorker',
      entry: 'vs/language/json/json.worker',
      output: 'json.worker.js',
      fallback: 'vs/language/json/jsonWorker',
    },
  },
  less: {
    entry: 'vs/basic-languages/less/less.contribution',
    worker: undefined,
  },
  lua: {
    entry: 'vs/basic-languages/lua/lua.contribution',
    worker: undefined,
  },
  markdown: {
    entry: 'vs/basic-languages/markdown/markdown.contribution',
    worker: undefined,
  },
  msdax: {
    entry: 'vs/basic-languages/msdax/msdax.contribution',
    worker: undefined,
  },
  mysql: {
    entry: 'vs/basic-languages/mysql/mysql.contribution',
    worker: undefined,
  },
  objective: {
    entry: 'vs/basic-languages/objective-c/objective-c.contribution',
    worker: undefined,
  },
  perl: {
    entry: 'vs/basic-languages/perl/perl.contribution',
    worker: undefined,
  },
  pgsql: {
    entry: 'vs/basic-languages/pgsql/pgsql.contribution',
    worker: undefined,
  },
  php: {
    entry: 'vs/basic-languages/php/php.contribution',
    worker: undefined,
  },
  postiats: {
    entry: 'vs/basic-languages/postiats/postiats.contribution',
    worker: undefined,
  },
  powerquery: {
    entry: 'vs/basic-languages/powerquery/powerquery.contribution',
    worker: undefined,
  },
  powershell: {
    entry: 'vs/basic-languages/powershell/powershell.contribution',
    worker: undefined,
  },
  pug: {
    entry: 'vs/basic-languages/pug/pug.contribution',
    worker: undefined,
  },
  python: {
    entry: 'vs/basic-languages/python/python.contribution',
    worker: undefined,
  },
  r: {
    entry: 'vs/basic-languages/r/r.contribution',
    worker: undefined,
  },
  razor: {
    entry: 'vs/basic-languages/razor/razor.contribution',
    worker: undefined,
  },
  redis: {
    entry: 'vs/basic-languages/redis/redis.contribution',
    worker: undefined,
  },
  redshift: {
    entry: 'vs/basic-languages/redshift/redshift.contribution',
    worker: undefined,
  },
  ruby: {
    entry: 'vs/basic-languages/ruby/ruby.contribution',
    worker: undefined,
  },
  rust: {
    entry: 'vs/basic-languages/rust/rust.contribution',
    worker: undefined,
  },
  sb: {
    entry: 'vs/basic-languages/sb/sb.contribution',
    worker: undefined,
  },
  scheme: {
    entry: 'vs/basic-languages/scheme/scheme.contribution',
    worker: undefined,
  },
  scss: {
    entry: 'vs/basic-languages/scss/scss.contribution',
    worker: undefined,
  },
  shell: {
    entry: 'vs/basic-languages/shell/shell.contribution',
    worker: undefined,
  },
  solidity: {
    entry: 'vs/basic-languages/solidity/solidity.contribution',
    worker: undefined,
  },
  sql: {
    entry: 'vs/basic-languages/sql/sql.contribution',
    worker: undefined,
  },
  st: {
    entry: 'vs/basic-languages/st/st.contribution',
    worker: undefined,
  },
  swift: {
    entry: 'vs/basic-languages/swift/swift.contribution',
    worker: undefined,
  },
  typescript: {
    entry: [
      'vs/basic-languages/typescript/typescript.contribution',
      'vs/language/typescript/monaco.contribution',
    ],
    worker: {
      id: 'vs/language/typescript/tsWorker',
      entry: 'vs/language/typescript/ts.worker',
      output: 'typescript.worker.js',
      fallback: 'vs/language/typescript/tsWorker',
    },
  },
  vb: {
    entry: 'vs/basic-languages/vb/vb.contribution',
    worker: undefined,
  },
  xml: {
    entry: 'vs/basic-languages/xml/xml.contribution',
    worker: undefined,
  },
  yaml: {
    entry: 'vs/basic-languages/yaml/yaml.contribution',
    worker: undefined,
  },
};
