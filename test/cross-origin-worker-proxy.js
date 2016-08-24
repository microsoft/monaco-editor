var baseUrl = self.location.hash;
baseUrl = baseUrl.replace(/^#/, '');
baseUrl = baseUrl.replace(/vs$/, '');

console.log('WORKER BASE_URL: ' + baseUrl);

self.MonacoEnvironment = {
	baseUrl: baseUrl
};
importScripts(baseUrl + 'vs/base/worker/workerMain.js');