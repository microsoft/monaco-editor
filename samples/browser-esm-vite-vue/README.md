
# Monaco Editor with Vue.js and Vite

This is a sample project using Vue.js 3, Vite, and Monaco Editor.

## Features

- ✅ Vue.js 3 Composition API
- ✅ TypeScript support
- ✅ Vite build tool
- ✅ Monaco Editor integration
- ✅ Syntax highlighting and code completion
- ✅ Multi-language support (TypeScript, JavaScript, JSON, CSS, HTML)

## Installation

```bash
npm install
```

## Usage

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run serve
```

## Project Structure

```
src/
├── components/
│   └── Editor.vue          # Monaco Editor component
├── main.ts                 # Vue app entry
├── userWorker.ts           # Monaco Editor Workers config
└── vite-env.d.ts           # TypeScript type declarations
```

## Tech Stack

- Vue.js 3
- TypeScript
- Vite
- Monaco Editor

## Comparison with React Version

This Vue version has the same features as the React version. Main differences:

1. Uses Vue 3 Composition API instead of React Hooks
2. Uses `@vitejs/plugin-vue` instead of `@vitejs/plugin-react`
3. Uses `.vue` single file components instead of `.tsx` files
4. Uses `createApp` instead of `ReactDOM.render`

## Monaco Editor Configuration

Monaco Editor runs via Web Workers and supports the following languages:
- TypeScript/JavaScript
- JSON
- CSS/SCSS/Less
- HTML/Handlebars/Razor