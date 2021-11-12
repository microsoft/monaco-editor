# Monaco Languages

Colorization and configuration supports for multiple languages for the Monaco Editor:

![monaco-languages](https://cloud.githubusercontent.com/assets/5047891/15938606/1fd4bac6-2e74-11e6-8839-d455da8bc8a7.gif)

## Development

- watch with `npm run watch`
- compile with `npm run prepublishOnly`
- test with `npm run test`

## Dev: Adding a new language

- create `$/src/myLang/myLang.contribution.ts`
- create `$/src/myLang/myLang.ts`
- create `$/src/myLang/myLang.test.ts`
- edit `$/src/monaco.contribution.ts` and register your new language

```js
import './myLang/myLang.contribution';
```
