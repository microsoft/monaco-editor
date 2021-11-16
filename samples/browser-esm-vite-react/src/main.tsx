import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
import './userWorker';

ReactDOM.render(
	<React.StrictMode>
		<Editor />
	</React.StrictMode>,
	document.getElementById('root')
);
