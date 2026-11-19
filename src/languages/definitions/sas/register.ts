import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'sas',
	extensions: ['.sas'],
	aliases: ['SAS'],
	loader: () => import('./sas')
});
