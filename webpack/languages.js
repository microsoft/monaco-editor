module.exports = {
  bat: {
    entry: 'vs/basic-languages/bat/bat.contribution',
    worker: undefined,
    alias: undefined,
  },
  coffee: {
    entry: 'vs/basic-languages/coffee/coffee.contribution',
    worker: undefined,
    alias: undefined,
  },
  cpp: {
    entry: 'vs/basic-languages/cpp/cpp.contribution',
    worker: undefined,
    alias: undefined,
  },
  csharp: {
    entry: 'vs/basic-languages/csharp/csharp.contribution',
    worker: undefined,
    alias: undefined,
  },
  csp: {
    entry: 'vs/basic-languages/csp/csp.contribution',
    worker: undefined,
    alias: undefined,
  },
  css: {
    entry: 'vs/language/css/monaco.contribution',
    worker: {
      id: 'vs/language/css/cssWorker',
      entry: 'vs/language/css/css.worker',
      output: 'css.worker.js',
      fallback: 'vs/language/css/cssWorker',
    },
    alias: undefined,
  },
  dockerfile: {
    entry: 'vs/basic-languages/dockerfile/dockerfile.contribution',
    worker: undefined,
    alias: undefined,
  },
  fsharp: {
    entry: 'vs/basic-languages/fsharp/fsharp.contribution',
    worker: undefined,
    alias: undefined,
  },
  go: {
    entry: 'vs/basic-languages/go/go.contribution',
    worker: undefined,
    alias: undefined,
  },
  handlebars: {
    entry: 'vs/basic-languages/handlebars/handlebars.contribution',
    worker: undefined,
    alias: undefined,
  },
  html: {
    entry: 'vs/language/html/monaco.contribution',
    worker: {
      id: 'vs/language/html/htmlWorker',
      entry: 'vs/language/html/html.worker',
      output: 'html.worker.js',
      fallback: 'vs/language/html/htmlWorker',
    },
    alias: undefined,
  },
  ini: {
    entry: 'vs/basic-languages/ini/ini.contribution',
    worker: undefined,
    alias: undefined,
  },
  java: {
    entry: 'vs/basic-languages/java/java.contribution',
    worker: undefined,
    alias: undefined,
  },
  json: {
    entry: 'vs/language/json/monaco.contribution',
    worker: {
      id: 'vs/language/json/jsonWorker',
      entry: 'vs/language/json/json.worker',
      output: 'json.worker.js',
      fallback: 'vs/language/json/jsonWorker',
    },
    alias: undefined,
  },
  less: {
    entry: 'vs/basic-languages/less/less.contribution',
    worker: undefined,
    alias: undefined,
  },
  lua: {
    entry: 'vs/basic-languages/lua/lua.contribution',
    worker: undefined,
    alias: undefined,
  },
  markdown: {
    entry: 'vs/basic-languages/markdown/markdown.contribution',
    worker: undefined,
    alias: undefined,
  },
  msdax: {
    entry: 'vs/basic-languages/msdax/msdax.contribution',
    worker: undefined,
    alias: undefined,
  },
  mysql: {
    entry: 'vs/basic-languages/mysql/mysql.contribution',
    worker: undefined,
    alias: undefined,
  },
  objective: {
    entry: 'vs/basic-languages/objective-c/objective-c.contribution',
    worker: undefined,
    alias: undefined,
  },
  pgsql: {
    entry: 'vs/basic-languages/pgsql/pgsql.contribution',
    worker: undefined,
    alias: undefined,
  },
  php: {
    entry: 'vs/basic-languages/php/php.contribution',
    worker: undefined,
    alias: undefined,
  },
  postiats: {
    entry: 'vs/basic-languages/postiats/postiats.contribution',
    worker: undefined,
    alias: undefined,
  },
  powershell: {
    entry: 'vs/basic-languages/powershell/powershell.contribution',
    worker: undefined,
    alias: undefined,
  },
  pug: {
    entry: 'vs/basic-languages/pug/pug.contribution',
    worker: undefined,
    alias: undefined,
  },
  python: {
    entry: 'vs/basic-languages/python/python.contribution',
    worker: undefined,
    alias: undefined,
  },
  r: {
    entry: 'vs/basic-languages/r/r.contribution',
    worker: undefined,
    alias: undefined,
  },
  razor: {
    entry: 'vs/basic-languages/razor/razor.contribution',
    worker: undefined,
    alias: undefined,
  },
  redis: {
    entry: 'vs/basic-languages/redis/redis.contribution',
    worker: undefined,
    alias: undefined,
  },
  redshift: {
    entry: 'vs/basic-languages/redshift/redshift.contribution',
    worker: undefined,
    alias: undefined,
  },
  ruby: {
    entry: 'vs/basic-languages/ruby/ruby.contribution',
    worker: undefined,
    alias: undefined,
  },
  sb: {
    entry: 'vs/basic-languages/sb/sb.contribution',
    worker: undefined,
    alias: undefined,
  },
  scss: {
    entry: 'vs/basic-languages/scss/scss.contribution',
    worker: undefined,
    alias: undefined,
  },
  solidity: {
    entry: 'vs/basic-languages/solidity/solidity.contribution',
    worker: undefined,
    alias: undefined,
  },
  sql: {
    entry: 'vs/basic-languages/sql/sql.contribution',
    worker: undefined,
    alias: undefined,
  },
  swift: {
    entry: 'vs/basic-languages/swift/swift.contribution',
    worker: undefined,
    alias: undefined,
  },
  typescript: {
    entry: 'vs/language/typescript/monaco.contribution',
    worker: {
      id: 'vs/language/typescript/tsWorker',
      entry: 'vs/language/typescript/ts.worker',
      output: 'typescript.worker.js',
      fallback: 'vs/language/typescript/tsWorker',
    },
    alias: ['javascript'],
  },
  vb: {
    entry: 'vs/basic-languages/vb/vb.contribution',
    worker: undefined,
    alias: undefined,
  },
  xml: {
    entry: 'vs/basic-languages/xml/xml.contribution',
    worker: undefined,
    alias: undefined,
  },
  yaml: {
    entry: 'vs/basic-languages/yaml/yaml.contribution',
    worker: undefined,
    alias: undefined,
  },
};
