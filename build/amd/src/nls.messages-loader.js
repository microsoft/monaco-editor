export function load(name, req, load, config) {
	const requestedLanguage = config['vs/nls']?.availableLanguages?.['*'];
	if (!requestedLanguage || requestedLanguage === 'en') {
		load({});
	} else {
		req([`vs/nls.messages.${requestedLanguage}`], () => {
			load({});
		});
	}
}
