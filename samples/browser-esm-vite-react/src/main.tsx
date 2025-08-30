import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Editor } from './components/Editor'

import './userWorker'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Editor />,
	</StrictMode>,
)
