// Register a new language
monaco.languages.register({ id: 'mySpecialLanguage' });

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
	tokenizer: {
		root: [
			[/\[error.*/, "custom-error"],
			[/\[notice.*/, "custom-notice"],
			[/\[info.*/, "custom-info"],
			[/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
		]
	}
});

// Define a new theme that contains only rules that match this language
monaco.editor.defineTheme('myCoolTheme', {
	base: 'vs',
	inherit: false,
	rules: [
		{ token: 'custom-info', foreground: '808080' },
		{ token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
		{ token: 'custom-notice', foreground: 'FFA500' },
		{ token: 'custom-date', foreground: '008800' },
	]
});

// Register a completion item provider for the new language
monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
	provideCompletionItems: () => {
		return [
			{
				label: 'simpleText',
				kind: monaco.languages.CompletionItemKind.Text
			}, {
				label: 'testing',
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: {
					value: 'testing(${1:condition})'
				}
			},
			{
				label: 'ifelse',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: {
					value: [
						'if (${1:condition}) {',
						'\t$0',
						'} else {',
						'\t',
						'}'
					].join('\n')
				},
				documentation: 'If-Else Statement'
			}
		]
	}
});

monaco.editor.create(document.getElementById("container"), {
	theme: 'myCoolTheme',
	value: getCode(),
	language: 'mySpecialLanguage'
});

function getCode() {
	return [
		'[Sun Mar 7 16:02:00 2004] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations',
		'[Sun Mar 7 16:02:00 2004] [info] Server built: Feb 27 2004 13:56:37',
		'[Sun Mar 7 16:02:00 2004] [notice] Accept mutex: sysvsem (Default: sysvsem)',
		'[Sun Mar 7 16:05:49 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 16:45:56 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 17:13:50 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 17:21:44 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 17:23:53 2004] statistics: Use of uninitialized value in concatenation (.) or string at /home/httpd/twiki/lib/TWiki.pm line 528.',
		'[Sun Mar 7 17:23:53 2004] statistics: Can\'t create file /home/httpd/twiki/data/Main/WebStatistics.txt - Permission denied',
		'[Sun Mar 7 17:27:37 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 17:31:39 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 17:58:00 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:00:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:10:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:19:01 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:42:29 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:52:30 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 18:58:52 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 19:03:58 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 19:08:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:04:35 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:11:33 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:12:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:25:31 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:44:48 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 20:58:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 21:16:17 2004] [error] [client xx.xx.xx.xx] File does not exist: /home/httpd/twiki/view/Main/WebHome',
		'[Sun Mar 7 21:20:14 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 21:31:12 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 21:39:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Sun Mar 7 21:44:10 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 01:35:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 01:47:06 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 01:59:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 02:12:24 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 02:54:54 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 03:46:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 03:48:18 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 03:52:17 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 03:55:09 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 04:22:55 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 04:24:47 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 04:40:32 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 04:55:40 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 04:59:13 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 05:22:57 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 05:24:29 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'[Mon Mar 8 05:31:47 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed',
		'<11>httpd[31628]: [error] [client xx.xx.xx.xx] File does not exist: /usr/local/installed/apache/htdocs/squirrelmail/_vti_inf.html in 29-Mar 15:18:20.50 from xx.xx.xx.xx',
		'<11>httpd[25859]: [error] [client xx.xx.xx.xx] File does not exist: /usr/local/installed/apache/htdocs/squirrelmail/_vti_bin/shtml.exe/_vti_rpc in 29-Mar 15:18:20.54 from xx.xx.xx.xx',
	].join('\n');;
}
