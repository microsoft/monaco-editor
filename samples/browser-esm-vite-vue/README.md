# Monaco Editor with Vue.js and Vite

这是一个使用Vue.js 3、Vite和Monaco Editor的示例项目。

## 特性

- ✅ Vue.js 3 Composition API
- ✅ TypeScript 支持
- ✅ Vite 构建工具
- ✅ Monaco Editor 集成
- ✅ 语法高亮和代码补全
- ✅ 多语言支持（TypeScript、JavaScript、JSON、CSS、HTML）

## 安装

```bash
npm install
```

## 运行

开发模式：
```bash
npm run dev
```

构建生产版本：
```bash
npm run build
```

预览构建版本：
```bash
npm run serve
```

## 项目结构

```
src/
├── components/
│   └── Editor.vue          # Monaco Editor 组件
├── main.ts                 # Vue 应用入口
├── userWorker.ts          # Monaco Editor Workers 配置
└── vite-env.d.ts          # TypeScript 类型声明
```

## 技术栈

- Vue.js 3
- TypeScript
- Vite
- Monaco Editor

## 对比 React 版本

这个 Vue 版本与 React 版本功能相同，主要区别：

1. 使用 Vue 3 Composition API 替代 React Hooks
2. 使用 `@vitejs/plugin-vue` 替代 `@vitejs/plugin-react`
3. 使用 `.vue` 单文件组件替代 `.tsx` 文件
4. 使用 `createApp` 替代 `ReactDOM.render`

## Monaco Editor 配置

Monaco Editor 通过 Web Workers 运行，支持以下语言：
- TypeScript/JavaScript
- JSON
- CSS/SCSS/Less
- HTML/Handlebars/Razor