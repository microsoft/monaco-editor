/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const conf: IRichLanguageConfiguration = {
	comments: {
		lineComment: '--',
		blockComment: ['/*', '*/'],
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: '\'', close: '\'' },
	]
};

export const language = <ILanguage>{
	defaultToken: '',
	tokenPostfix: '.sql',
	ignoreCase: true,

	brackets: [
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	keywords: [
		"APPEND", "AUTH", "BGREWRITEAOF", "BGSAVE", "BITCOUNT", "BITFIELD", "BITOP", "BITPOS", "BLPOP", "BRPOP", "BRPOPLPUSH",
		"CLIENT", "KILL", "LIST", "GETNAME", "PAUSE", "REPLY", "SETNAME", "CLUSTER", "ADDSLOTS", "COUNT-FAILURE-REPORTS",
		"COUNTKEYSINSLOT", "DELSLOTS", "FAILOVER", "FORGET", "GETKEYSINSLOT", "INFO", "KEYSLOT", "MEET", "NODES", "REPLICATE",
		"RESET", "SAVECONFIG", "SET-CONFIG-EPOCH", "SETSLOT", "SLAVES", "SLOTS", "COMMAND", "COUNT", "GETKEYS", "CONFIG", "GET",
		"REWRITE", "SET", "RESETSTAT", "DBSIZE", "DEBUG", "OBJECT", "SEGFAULT", "DECR", "DECRBY", "DEL", "DISCARD", "DUMP", "ECHO",
		"EVAL", "EVALSHA", "EXEC", "EXISTS", "EXPIRE", "EXPIREAT", "FLUSHALL", "FLUSHDB", "GEOADD", "GEOHASH", "GEOPOS", "GEODIST",
		"GEORADIUS", "GEORADIUSBYMEMBER", "GETBIT", "GETRANGE", "GETSET", "HDEL", "HEXISTS", "HGET", "HGETALL", "HINCRBY", "HINCRBYFLOAT",
		"HKEYS", "HLEN", "HMGET", "HMSET", "HSET", "HSETNX", "HSTRLEN", "HVALS", "INCR", "INCRBY", "INCRBYFLOAT", "KEYS", "LASTSAVE",
		"LINDEX", "LINSERT", "LLEN", "LPOP", "LPUSH", "LPUSHX", "LRANGE", "LREM", "LSET", "LTRIM", "MGET", "MIGRATE", "MONITOR",
		"MOVE", "MSET", "MSETNX", "MULTI", "PERSIST", "PEXPIRE", "PEXPIREAT", "PFADD", "PFCOUNT", "PFMERGE", "PING", "PSETEX",
		"PSUBSCRIBE", "PUBSUB", "PTTL", "PUBLISH", "PUNSUBSCRIBE", "QUIT", "RANDOMKEY", "READONLY", "READWRITE", "RENAME", "RENAMENX",
		"RESTORE", "ROLE", "RPOP", "RPOPLPUSH", "RPUSH", "RPUSHX", "SADD", "SAVE", "SCARD", "SCRIPT", "FLUSH", "LOAD", "SDIFF",
		"SDIFFSTORE", "SELECT", "SETBIT", "SETEX", "SETNX", "SETRANGE", "SHUTDOWN", "SINTER", "SINTERSTORE", "SISMEMBER", "SLAVEOF",
		"SLOWLOG", "SMEMBERS", "SMOVE", "SORT", "SPOP", "SRANDMEMBER", "SREM", "STRLEN", "SUBSCRIBE", "SUNION", "SUNIONSTORE", "SWAPDB",
		"SYNC", "TIME", "TOUCH", "TTL", "TYPE", "UNSUBSCRIBE", "UNLINK", "UNWATCH", "WAIT", "WATCH", "ZADD", "ZCARD", "ZCOUNT", "ZINCRBY",
		"ZINTERSTORE", "ZLEXCOUNT", "ZRANGE", "ZRANGEBYLEX", "ZREVRANGEBYLEX", "ZRANGEBYSCORE", "ZRANK", "ZREM", "ZREMRANGEBYLEX",
		"ZREMRANGEBYRANK", "ZREMRANGEBYSCORE", "ZREVRANGE", "ZREVRANGEBYSCORE", "ZREVRANK", "ZSCORE", "ZUNIONSTORE", "SCAN", "SSCAN",
		"HSCAN", "ZSCAN"
	],
	operators: [
		// NOT SUPPORTED
	],
	builtinFunctions: [
		// NOT SUPPORTED
	],
	builtinVariables: [
		// NOT SUPPORTED
	],
	pseudoColumns: [
		// NOT SUPPORTED
	],
	tokenizer: {
		root: [
			{ include: '@comments' },
			{ include: '@whitespace' },
			{ include: '@pseudoColumns' },
			{ include: '@numbers' },
			{ include: '@strings' },
			{ include: '@complexIdentifiers' },
			{ include: '@scopes' },
			[/[;,.]/, 'delimiter'],
			[/[()]/, '@brackets'],
			[/[\w@#$]+/, {
				cases: {
					'@keywords': 'keyword',
					'@operators': 'operator',
					'@builtinVariables': 'predefined',
					'@builtinFunctions': 'predefined',
					'@default': 'identifier'
				}
			}],
			[/[<>=!%&+\-*/|~^]/, 'operator'],
		],
		whitespace: [
			[/\s+/, 'white']
		],
		comments: [
			[/--+.*/, 'comment'],
			[/#+.*/, 'comment'],
			[/\/\*/, { token: 'comment.quote', next: '@comment' }]
		],
		comment: [
			[/[^*/]+/, 'comment'],
			// Not supporting nested comments, as nested comments seem to not be standard?
			// i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
			// [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
			[/\*\//, { token: 'comment.quote', next: '@pop' }],
			[/./, 'comment']
		],
		pseudoColumns: [
			[/[$][A-Za-z_][\w@#$]*/, {
				cases: {
					'@pseudoColumns': 'predefined',
					'@default': 'identifier'
				}
			}],
		],
		numbers: [
			[/0[xX][0-9a-fA-F]*/, 'number'],
			[/[$][+-]*\d*(\.\d*)?/, 'number'],
			[/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
		],
		strings: [
			[/'/, { token: 'string', next: '@string' }],
			[/"/, { token: 'string', next: '@string' }]
		],
		string: [
			[/[^']+/, 'string'],
			[/[^"]+/, 'string'],
			[/''/, 'string'],
			[/""/, 'string'],
			[/'/, { token: 'string', next: '@pop' }],
			[/"/, { token: 'string', next: '@pop' }]
		],
		complexIdentifiers: [

			[/`/, { token: 'identifier.quote', next: '@quotedIdentifier' }]
		],
		quotedIdentifier: [
			[/[^`]+/, 'identifier'],
			[/``/, 'identifier'],
			[/`/, { token: 'identifier.quote', next: '@pop' }]
		],
		scopes: [
			// NOT SUPPORTED
		]
	}
};
