# Monaco Editor

[![Versions](https://img.shields.io/npm/v/monaco-editor)](https://www.npmjs.com/package/monaco-editor)
[![Versions](https://img.shields.io/npm/v/monaco-editor/next)](https://www.npmjs.com/package/monaco-editor)
[![Feature Requests](https://img.shields.io/github/issues/microsoft/monaco-editor/feature-request.svg)](https://github.com/microsoft/monaco-editor/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
[![Bugs](https://img.shields.io/github/issues/microsoft/monaco-editor/bug.svg)](https://github.com/microsoft/monaco-editor/issues?utf8=✓&q=is%3Aissue+is%3Aopen+label%3Abug)

The Monaco Editor is the fully featured code editor from [VS Code](https://github.com/microsoft/vscode). Check out the [VS Code docs](https://code.visualstudio.com/docs/editor/editingevolved) to see some of the supported features.

![image](https://user-images.githubusercontent.com/5047891/94183711-290c0780-fea3-11ea-90e3-c88ff9d21bd6.png)

## Try it out

Try out the editor and see various examples [in our interactive playground](https://microsoft.github.io/monaco-editor/playground.html).

The playground is the best way to learn about how to use the editor, which features is supports, to try out different versions and to create minimal reproducible examples for bug reports.

## Installing

```
> npm install monaco-editor
```

You will get:

- inside `/esm`: ESM version of the editor (compatible with e.g. webpack)
- `monaco.d.ts`: this specifies the API of the editor (this is what is actually versioned, everything else is considered private and might break with any release).

:warning: The monaco editor also ships an `AMD` build for backwards-compatibility reasons, but the `AMD` support is deprecated and will be removed in future versions.

## Localization

To load the editor in a specific language, make sure that the corresponding nls script file is loaded before the main monaco editor script. For example, to load the editor in German, include the following script tag:
```html
<script src="path/to/monaco-editor/esm/nls.messages.de.js"></script>
```

Check the sources for available languages.

## Concepts

Monaco editor is best known for being the text editor that powers VS Code. However, it's a bit more nuanced. Some basic understanding about the underlying concepts is needed to use Monaco editor effectively.

### Models

Models are at the heart of Monaco editor. It's what you interact with when managing content. A model represents a file that has been opened. This could represent a file that exists on a file system, but it doesn't have to. For example, the model holds the text content, determines the language of the content, and tracks the edit history of the content.

### URIs

Each model is identified by a URI. This is why it's not possible for two models to have the same URI. Ideally when you represent content in Monaco editor, you should think of a virtual file system that matches the files your users are editing. For example, you could use `file:///` as a base path. If a model is created without a URI, its URI will be `inmemory://model/1`. The number increases as more models are created.

### Editors

An editor is a user facing view of the model. This is what gets attached to the DOM and what your users see visually. Typical editor operations are displaying a model, managing the view state, or executing actions or commands.

### Providers

Providers provide smart editor features. For example, this includes completion and hover information. It is not the same as, but often maps to [language server protocol](https://microsoft.github.io/language-server-protocol) features.

Providers work on models. Some smart features depends on the file URI. For example, for TypeScript to resolve imports, or for JSON IntelliSense to determine which JSON schema to apply to which model. So it's important to choose proper model URIs.

### Disposables

Many Monaco related objects often implement the `.dispose()` method. This method is intended to perform cleanups when a resource is no longer needed. For example, calling `model.dispose()` will unregister it, freeing up the URI for a new model. Editors should be disposed to free up resources and remove their model listeners.

## Documentation

- Learn how to integrate the editor with these [complete samples](./samples/).
  - [Integrate the ESM version](./docs/integrate-esm.md)
- Learn how to use the editor API and try out your own customizations in the [playground](https://microsoft.github.io/monaco-editor/playground.html).
- Explore the [API docs](https://microsoft.github.io/monaco-editor/docs.html) or read them straight from [`monaco.d.ts`](https://github.com/microsoft/monaco-editor/blob/gh-pages/node_modules/monaco-editor/monaco.d.ts).
- Read [this guide](https://github.com/microsoft/monaco-editor/wiki/Accessibility-Guide-for-Integrators) to ensure the editor is accessible to all your users!
- Create a Monarch tokenizer for a new programming language [in the Monarch playground](https://microsoft.github.io/monaco-editor/monarch.html).
- Ask questions on [StackOverflow](https://stackoverflow.com/questions/tagged/monaco-editor)! Search open and closed issues, there are a lot of tips in there!

## Issues

Create [issues](https://github.com/microsoft/monaco-editor/issues) in this repository for anything related to the Monaco Editor. Please search for existing issues to avoid duplicates.

## FAQ

❓ **What is the relationship between VS Code and the Monaco Editor?**

The Monaco Editor is generated straight from VS Code's sources with some shims around services the code needs to make it run in a web browser outside of its home.

❓ **What is the relationship between VS Code's version and the Monaco Editor's version?**

None. The Monaco Editor is a library and it reflects directly the source code.

❓ **I've written an extension for VS Code, will it work on the Monaco Editor in a browser?**

No.

> Note: If the extension is fully based on the [LSP](https://microsoft.github.io/language-server-protocol/) and if the language server is authored in JavaScript, then it would be possible.

❓ **Why all these web workers and why should I care?**

Language services create web workers to compute heavy stuff outside of the UI thread. They cost hardly anything in terms of resource overhead and you shouldn't worry too much about them, as long as you get them to work (see above the cross-domain case).

❓ **I see the warning "Could not create web worker". What should I do?**

HTML5 does not allow pages loaded on `file://` to create web workers. Please load the editor with a web server on `http://` or `https://` schemes.

❓ **Is the editor supported in mobile browsers or mobile web app frameworks?**

No.

❓ **Why doesn't the editor support TextMate grammars?**

- Please see https://github.com/bolinfest/monaco-tm which puts together `monaco-editor`, `vscode-oniguruma` and `vscode-textmate` to get TM grammar support in the editor.

## Contributing / Local Development

We are welcoming contributions from the community!
Please see [CONTRIBUTING](./CONTRIBUTING.md) for details how you can contribute effectively, how you can run the editor from sources and how you can debug and fix issues.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

Licensed under the [MIT](https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt) License.


## 🌐 Web Resources & Interactive Index
- [BATTLE ARENA](https://welearnaction.onrender.com/battle-arena.html)
- [MERMAIDS SPOT THE DIFFERENCES](https://learnaction.github.io/mermaids-spot-the-differences.html)
- [BLOCK PUZZLE KING](https://welearnaction.onrender.com/block-puzzle-king.html)
- [CATEGORY ARMY40](https://welearnaction.onrender.com/category-army40.html)
- [RUMMY 500 CARD GAME](https://learnaction.github.io/rummy-500-card-game.html)
- [CATEGORY PUZZLE](https://welearnaction.onrender.com/category-puzzle.html)
- [BUBBLE SHOOTER VALE](https://welearnaction.onrender.com/bubble-shooter-vale.html)
- [STICKER BOOK PUZZLE COLOR BY NUMBER](https://welearnaction.onrender.com/sticker-book-puzzle-color-by-number.html)
- [SPELLMIND](https://welearnaction.onrender.com/spellmind.html)
- [ESCAPE FROM THE PORTAL](https://welearnaction.onrender.com/escape-from-the-portal.html)
- [FRUITSLAND ESCAPE FROM THE AMUSEMENT PARK](https://welearnaction.onrender.com/fruitsland-escape-from-the-amusement-park.html)
- [PARK FEVER](https://welearnaction.onrender.com/park-fever.html)
- [MONSTER SLAYERS](https://welearnaction.onrender.com/monster-slayers.html)
- [MOUNTAIN BUS DRIVER](https://welearnaction.onrender.com/mountain-bus-driver.html)
- [PUSHIO](https://welearnaction.onrender.com/pushio.html)
- [CARS MERGE](https://welearnaction.onrender.com/cars-merge.html)
- [CATEGORY CUTE62](https://welearnaction.onrender.com/category-cute62.html)
- [MERGE HAVEN](https://welearnaction.onrender.com/merge-haven.html)
- [BUBBLE SHOOTER CRYSTAL HUNT](https://welearnaction.onrender.com/bubble-shooter-crystal-hunt.html)
- [HOLE EAT GROW ATTACK](https://welearnaction.onrender.com/hole-eat-grow-attack.html)
- [IDLE TRADE ROUTES](https://welearnaction.onrender.com/idle-trade-routes.html)
- [PRIVACY](https://learnaction.github.io/privacy.html)
- [MAHJONG MASTERS](https://welearnaction.onrender.com/mahjong-masters.html)
- [POLYGON SPACE](https://welearnaction.onrender.com/polygon-space.html)
- [CATEGORY MANAGEMENT210](https://welearnaction.onrender.com/category-management210.html)
- [CAR MECHANIC SIMULATOR 2025](https://welearnaction.onrender.com/car-mechanic-simulator-2025.html)
- [BLOCKIBO COLOR BLOCKS](https://welearnaction.onrender.com/blockibo-color-blocks.html)
- [THRONE VS BALLOONS](https://welearnaction.onrender.com/throne-vs-balloons.html)
- [BLACKRIVER MYSTERY HIDDEN OBJECTS](https://welearnaction.onrender.com/blackriver-mystery-hidden-objects.html)
- [ISOMETRIC ESCAPE 2](https://welearnaction.onrender.com/isometric-escape-2.html)
- [ELEVATOR FIGHT](https://welearnaction.onrender.com/elevator-fight.html)
- [CATEGORY STUNT128](https://welearnaction.onrender.com/category-stunt128.html)
- [BANK BOOM TUNG TUNG SAHUR](https://welearnaction.onrender.com/bank-boom-tung-tung-sahur.html)
- [CATEGORY JIGSAW](https://learnaction.github.io/category-jigsaw.html)
- [CATEGORY FREE SOLITAIRE GAMES](https://learnaction.github.io/category-free-solitaire-games.html)
- [CATEGORY BATTLE](https://learnaction.github.io/category-battle.html)
- [CATEGORY CARDS](https://learnaction.github.io/category-cards.html)
- [CATEGORY CASUAL 2](https://learnaction.github.io/category-casual-2.html)
- [MEME MUKBANG ASMR GAME](https://welearnaction.onrender.com/meme-mukbang-asmr-game.html)
- [CATEGORY PIXEL313](https://learnaction.github.io/category-pixel313.html)
- [CATEGORY EDUCATIONAL](https://learnaction.github.io/category-educational.html)
- [ITALIAN BRAINROT PUZZLE BATTLE](https://welearnaction.onrender.com/italian-brainrot-puzzle-battle.html)
- [INDEX21](https://learnaction.github.io/index21.html)
- [CRY ISLANDS](https://welearnaction.onrender.com/cry-islands.html)
- [SNAKE PUZZLE ESCAPE](https://welearnaction.onrender.com/snake-puzzle-escape.html)
- [ROUGH BALL](https://welearnaction.onrender.com/rough-ball.html)
- [BOUNCEPOP QUEST](https://welearnaction.onrender.com/bouncepop-quest.html)
- [LAST UFO DEFENSE](https://welearnaction.onrender.com/last-ufo-defense.html)
- [GOLF MINI](https://welearnaction.onrender.com/golf-mini.html)
- [CATEGORY BIKE](https://welearnaction.onrender.com/category-bike.html)
- [CATEGORY THINKY](https://welearnaction.onrender.com/category-thinky.html)
- [INDEX18](https://learnaction.github.io/index18.html)
- [CATEGORY BRAIN260](https://learnaction.github.io/category-brain260.html)
- [ARCHERY LEGENDS](https://welearnaction.onrender.com/archery-legends.html)
- [TOCO TEENS HALLOWEEN PARTY](https://welearnaction.onrender.com/toco-teens-halloween-party.html)
- [OTU](https://welearnaction.onrender.com/otu.html)
- [COFFEE CRAZE SORTING GAME](https://welearnaction.onrender.com/coffee-craze-sorting-game.html)
- [REAL GT RACING SIMULATOR](https://welearnaction.onrender.com/real-gt-racing-simulator.html)
- [REAL CAR PARKING AND STUNT](https://welearnaction.onrender.com/real-car-parking-and-stunt.html)
- [CATEGORY HAIR](https://learnaction.github.io/category-hair.html)
- [CATEGORY BASKETBALL 2](https://learnaction.github.io/category-basketball-2.html)
- [BRAIN DRAW LINE](https://learnaction.github.io/brain-draw-line.html)
- [OBBY ESCAPE FROM TSUNAMI BRAINROT](https://welearnaction.onrender.com/obby-escape-from-tsunami-brainrot.html)
- [CATEGORY SKILL254](https://learnaction.github.io/category-skill254.html)
- [CATEGORY GUN238](https://learnaction.github.io/category-gun238.html)
- [CATEGORY SIMULATION](https://learnaction.github.io/category-simulation.html)
- [CATEGORY LOVE12](https://welearnaction.onrender.com/category-love12.html)
- [CATEGORY SPACE57](https://learnaction.github.io/category-space57.html)
- [SHOT CAN WILD](https://learnaction.netlify.app/shot-can-wild.html)
- [ISOMETRIC ESCAPE 2](https://learnaction.netlify.app/isometric-escape-2.html)
- [BUBBLE SHOOTER WILD WEST](https://learnaction.netlify.app/bubble-shooter-wild-west.html)
- [12 MINUTE ESCAPE](https://welearnaction.onrender.com/12-minute-escape.html)
- [TERMS](https://ilearnworld.github.io/terms.html)
- [CATEGORY PARTY23](https://learnaction.netlify.app/category-party23.html)
- [CATEGORY FLASH 2](https://learnaction.github.io/category-flash-2.html)
- [BRAINROT CLICKER](https://welearnaction.onrender.com/brainrot-clicker.html)
- [STICK KILL 3D](https://learnaction.netlify.app/stick-kill-3d.html)
- [ONLINE PORTAL](https://skillcrafts.github.io/)
- [LIMITED DEFENSE](https://welearnaction.onrender.com/limited-defense.html)
- [MUKI WIZARD](https://learnaction.netlify.app/muki-wizard.html)
- [LAZY DOG](https://welearnaction.onrender.com/lazy-dog.html)
- [CATEGORY BIKE 2](https://welearnaction.onrender.com/category-bike-2.html)
- [COLOR BRAIN TEST GAMES](https://learnaction.netlify.app/color-brain-test-games.html)
- [SMASH THE CAR TO PIECES](https://welearnaction.onrender.com/smash-the-car-to-pieces.html)
- [AMERICAN BLOCK SNIPER ONLINE](https://learnaction.netlify.app/american-block-sniper-online.html)
- [CATEGORY STRATEGY](https://learnaction.github.io/category-strategy.html)
- [GRENADE SIMULATOR](https://learnaction.netlify.app/grenade-simulator.html)
- [CATEGORY SOCCER 2](https://learnaction.github.io/category-soccer-2.html)
- [MR LONG LEGS](https://learnaction.netlify.app/mr-long-legs.html)
- [PRIVACY](https://themindplays.pages.dev/privacy.html)
- [PUZZLE PLAY](https://learnaction.netlify.app/puzzle-play.html)
- [FOOD JAM](https://learnaction.netlify.app/food-jam.html)
- [CATEGORY SOCCER 2](https://welearnaction.onrender.com/category-soccer-2.html)
- [FASHION PRINCESS DRESS UP FOR GIRLS](https://welearnaction.onrender.com/fashion-princess-dress-up-for-girls.html)
- [TERMS](https://themindplay.github.io/terms.html)
- [CATEGORY BLOCK94](https://learnaction.github.io/category-block94.html)
- [TWINKLE SHOOTER](https://welearnaction.onrender.com/twinkle-shooter.html)
- [SAVE THE BEES](https://learnaction.netlify.app/save-the-bees.html)
- [MEMEVOIO](https://learnaction.netlify.app/memevoio.html)
- [HUNGRY NOOB CAFE SIMULATOR](https://welearnaction.onrender.com/hungry-noob-cafe-simulator.html)
- [CATEGORY FLASH](https://welearnaction.onrender.com/category-flash.html)
- [CATEGORY SPOT THE DIFFERENCE6](https://learnaction.github.io/category-spot-the-difference6.html)
- [CONTACT](https://learnaction.github.io/contact.html)
- [CATEGORY BATTLESHIP19](https://learnaction.netlify.app/category-battleship19.html)
- [TERMS](https://thelearnquesters.pages.dev/terms.html)
- [CATEGORY ARENA255](https://learnaction.netlify.app/category-arena255.html)
- [OFFICE BRAWL ROOM SMASH](https://learnaction.github.io/office-brawl-room-smash.html)
- [ONLINE PORTAL](https://studyquesthub.web.app/)
- [TINY CARS](https://learnaction.netlify.app/tiny-cars.html)
- [DREAMY HOME](https://eduquests.netlify.app/dreamy-home.html)
- [BLOCK PUZZLE SLIDE BLOCK JAM](https://learnaction.github.io/block-puzzle-slide-block-jam.html)
- [GRANNY 3 RETURN THE SCHOOL](https://learnaction.github.io/granny-3-return-the-school.html)
- [CATEGORY CAR 2](https://learnaction.github.io/category-car-2.html)
- [SKATING PARK](https://eduquests.netlify.app/skating-park.html)
- [SOLITAIRE EMPEROR SECRETS OF FATE](https://welearnaction.onrender.com/solitaire-emperor-secrets-of-fate.html)
- [CATEGORY ESCAPE](https://learnaction.github.io/category-escape.html)
- [CATEGORY PIXEL313](https://learnaction.netlify.app/category-pixel313.html)
- [CRAFTY TOWN MERGE CITY](https://welearnaction.onrender.com/crafty-town-merge-city.html)
- [TIMBERLAND ARRANGE PUZZLE GAME](https://learnaction.netlify.app/timberland-arrange-puzzle-game.html)
- [CATEGORY PREMIUM PERKS71](https://learnaction.netlify.app/category-premium-perks71.html)
- [TERMS](https://cryptotify.pages.dev/terms.html)
- [ONLINE PORTAL](https://cryptotify9.onrender.com/)
- [MERGE CUBE CHALLENGE](https://learnaction.github.io/merge-cube-challenge.html)
- [CATEGORY ADVENTURE 3](https://learnaction.github.io/category-adventure-3.html)
- [CATEGORY ARENA255](https://welearnaction.onrender.com/category-arena255.html)
- [STICKMAN ZOMBIE VS STICKMAN HERO](https://learnaction.github.io/stickman-zombie-vs-stickman-hero.html)
- [GANG WAR STRIKE SHOOTER](https://eduquests.netlify.app/gang-war-strike-shooter.html)
- [CATEGORY WORLD CUP17](https://welearnaction.onrender.com/category-world-cup17.html)
- [KNIT BEARS](https://learnaction.netlify.app/knit-bears.html)
- [CATEGORY SURVIVAL366](https://learnaction.github.io/category-survival366.html)
