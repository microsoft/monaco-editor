"use strict";
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.37.1(20a8d5a651d057aaed7875ad1c1f2ecf13c4e773)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/redis/redis", ["require"],(require)=>{
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/basic-languages/redis/redis.ts
  var redis_exports = {};
  __export(redis_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".redis",
    ignoreCase: true,
    brackets: [
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" }
    ],
    keywords: [
      "APPEND",
      "AUTH",
      "BGREWRITEAOF",
      "BGSAVE",
      "BITCOUNT",
      "BITFIELD",
      "BITOP",
      "BITPOS",
      "BLPOP",
      "BRPOP",
      "BRPOPLPUSH",
      "CLIENT",
      "KILL",
      "LIST",
      "GETNAME",
      "PAUSE",
      "REPLY",
      "SETNAME",
      "CLUSTER",
      "ADDSLOTS",
      "COUNT-FAILURE-REPORTS",
      "COUNTKEYSINSLOT",
      "DELSLOTS",
      "FAILOVER",
      "FORGET",
      "GETKEYSINSLOT",
      "INFO",
      "KEYSLOT",
      "MEET",
      "NODES",
      "REPLICATE",
      "RESET",
      "SAVECONFIG",
      "SET-CONFIG-EPOCH",
      "SETSLOT",
      "SLAVES",
      "SLOTS",
      "COMMAND",
      "COUNT",
      "GETKEYS",
      "CONFIG",
      "GET",
      "REWRITE",
      "SET",
      "RESETSTAT",
      "DBSIZE",
      "DEBUG",
      "OBJECT",
      "SEGFAULT",
      "DECR",
      "DECRBY",
      "DEL",
      "DISCARD",
      "DUMP",
      "ECHO",
      "EVAL",
      "EVALSHA",
      "EXEC",
      "EXISTS",
      "EXPIRE",
      "EXPIREAT",
      "FLUSHALL",
      "FLUSHDB",
      "GEOADD",
      "GEOHASH",
      "GEOPOS",
      "GEODIST",
      "GEORADIUS",
      "GEORADIUSBYMEMBER",
      "GETBIT",
      "GETRANGE",
      "GETSET",
      "HDEL",
      "HEXISTS",
      "HGET",
      "HGETALL",
      "HINCRBY",
      "HINCRBYFLOAT",
      "HKEYS",
      "HLEN",
      "HMGET",
      "HMSET",
      "HSET",
      "HSETNX",
      "HSTRLEN",
      "HVALS",
      "INCR",
      "INCRBY",
      "INCRBYFLOAT",
      "KEYS",
      "LASTSAVE",
      "LINDEX",
      "LINSERT",
      "LLEN",
      "LPOP",
      "LPUSH",
      "LPUSHX",
      "LRANGE",
      "LREM",
      "LSET",
      "LTRIM",
      "MGET",
      "MIGRATE",
      "MONITOR",
      "MOVE",
      "MSET",
      "MSETNX",
      "MULTI",
      "PERSIST",
      "PEXPIRE",
      "PEXPIREAT",
      "PFADD",
      "PFCOUNT",
      "PFMERGE",
      "PING",
      "PSETEX",
      "PSUBSCRIBE",
      "PUBSUB",
      "PTTL",
      "PUBLISH",
      "PUNSUBSCRIBE",
      "QUIT",
      "RANDOMKEY",
      "READONLY",
      "READWRITE",
      "RENAME",
      "RENAMENX",
      "RESTORE",
      "ROLE",
      "RPOP",
      "RPOPLPUSH",
      "RPUSH",
      "RPUSHX",
      "SADD",
      "SAVE",
      "SCARD",
      "SCRIPT",
      "FLUSH",
      "LOAD",
      "SDIFF",
      "SDIFFSTORE",
      "SELECT",
      "SETBIT",
      "SETEX",
      "SETNX",
      "SETRANGE",
      "SHUTDOWN",
      "SINTER",
      "SINTERSTORE",
      "SISMEMBER",
      "SLAVEOF",
      "SLOWLOG",
      "SMEMBERS",
      "SMOVE",
      "SORT",
      "SPOP",
      "SRANDMEMBER",
      "SREM",
      "STRLEN",
      "SUBSCRIBE",
      "SUNION",
      "SUNIONSTORE",
      "SWAPDB",
      "SYNC",
      "TIME",
      "TOUCH",
      "TTL",
      "TYPE",
      "UNSUBSCRIBE",
      "UNLINK",
      "UNWATCH",
      "WAIT",
      "WATCH",
      "ZADD",
      "ZCARD",
      "ZCOUNT",
      "ZINCRBY",
      "ZINTERSTORE",
      "ZLEXCOUNT",
      "ZRANGE",
      "ZRANGEBYLEX",
      "ZREVRANGEBYLEX",
      "ZRANGEBYSCORE",
      "ZRANK",
      "ZREM",
      "ZREMRANGEBYLEX",
      "ZREMRANGEBYRANK",
      "ZREMRANGEBYSCORE",
      "ZREVRANGE",
      "ZREVRANGEBYSCORE",
      "ZREVRANK",
      "ZSCORE",
      "ZUNIONSTORE",
      "SCAN",
      "SSCAN",
      "HSCAN",
      "ZSCAN"
    ],
    operators: [],
    builtinFunctions: [],
    builtinVariables: [],
    pseudoColumns: [],
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@pseudoColumns" },
        { include: "@numbers" },
        { include: "@strings" },
        { include: "@scopes" },
        [/[;,.]/, "delimiter"],
        [/[()]/, "@brackets"],
        [
          /[\w@#$]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@operators": "operator",
              "@builtinVariables": "predefined",
              "@builtinFunctions": "predefined",
              "@default": "identifier"
            }
          }
        ],
        [/[<>=!%&+\-*/|~^]/, "operator"]
      ],
      whitespace: [[/\s+/, "white"]],
      pseudoColumns: [
        [
          /[$][A-Za-z_][\w@#$]*/,
          {
            cases: {
              "@pseudoColumns": "predefined",
              "@default": "identifier"
            }
          }
        ]
      ],
      numbers: [
        [/0[xX][0-9a-fA-F]*/, "number"],
        [/[$][+-]*\d*(\.\d*)?/, "number"],
        [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, "number"]
      ],
      strings: [
        [/'/, { token: "string", next: "@string" }],
        [/"/, { token: "string.double", next: "@stringDouble" }]
      ],
      string: [
        [/[^']+/, "string"],
        [/''/, "string"],
        [/'/, { token: "string", next: "@pop" }]
      ],
      stringDouble: [
        [/[^"]+/, "string.double"],
        [/""/, "string.double"],
        [/"/, { token: "string.double", next: "@pop" }]
      ],
      scopes: []
    }
  };
  return __toCommonJS(redis_exports);
})();
return moduleExports;
});
