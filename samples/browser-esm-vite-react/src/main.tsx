import React from 'react';
import ReactDOM from 'react-dom';
import './userWorker';
import { Editor } from './components/Editor';
// import { Editor } from './components/Editor2';

ReactDOM.render(
	<React.StrictMode>
		<Editor />
	</React.StrictMode>,
	document.getElementById('root')
);
