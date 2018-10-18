# Contribuer et maintenir

Ce guide contient la version d’installation légère (il suffit pour cela que vous ayez installé node.js). Si vous souhaitez pouvoir utiliser vscode à partir du code source, veuillez vous reporter à la section Comment contribuer de VSCode.

### Une brève explication sur la structure du code source
Ce référentiel ne contient pas de code source, il ne contient que les scripts pour tout compiler et expédier le module monaco-editor npm:

Ces packages sont décrits dans le fichier racine appelé metadata.js et il est possible de créer une distribution d'éditeur contenant uniquement certains plugins en modifiant ce fichier.

explication du module npm du référentiel
vscode la fonctionnalité principale de monaco-editor-core editor (langage autonome) est livrée à partir de vscode.
monaco-languages ​​plug-in monaco-languages ​​qui ajoute de la colorisation et des supports de base pour des dizaines de langues.
monaco-typescript plug-in monaco-typescript qui ajoute la prise en charge de langages riches pour JavaScript et TypeScript.
monaco-css plugin monaco-css qui ajoute la prise en charge des langages riches pour CSS, LESS et SCSS.
monaco-json plug-in monaco-json qui ajoute la prise en charge de langages riches pour JSON.
monaco-html plugin monaco-html qui ajoute un support de langage enrichi pour HTML.
Lancer l'éditeur depuis le source
Toute la configuration de construction de VS Code est nécessaire pour pouvoir construire l'éditeur Monaco.

Installez toutes les conditions préalables: https://github.com/Microsoft/vscode/wiki/How-to-Contribute#installing-prerequisites
OS X et Linux
/ src> git clone https://github.com/microsoft/vscode
/ src> cd vscode
### install npm deps for vscode
/ src / vscode> ./scripts/npm.sh install
### lance le compilateur en tâche de fond
/ src / vscode> npm run watch
les fenêtres
/ src> git clone https://github.com/microsoft/vscode
/ src> cd vscode
####install npm deps for vscode
/ src / vscode> scripts \ npm.bat install
### lance le compilateur en tâche de fond
/ src / vscode> npm run watch
Pour les pages de test de Monaco Editor:
### clone monaco-editor (notez que les dossiers doivent être des frères et soeurs!)
/ src> git clone https://github.com/Microsoft/monaco-editor

### install npm deps pour monaco-editor
/ src / monaco-editor> npm install.

### démarre un serveur http local en arrière-plan
/ src / monaco-editor> npm run simpleserver
Ouvrez http: // localhost: 8080 / monaco-editor / test /? Editor = src à exécuter.

Exécution d’un plugin à partir de la source (par exemple monaco-typescript)
### clone monaco-typescript
/ src> git clone https://github.com/Microsoft/monaco-typescript

### install npm deps pour monaco-typescript
/ src / monaco-typescript> npm install.

### lance le compilateur en tâche de fond
/ src / monaco-typescript> npm run watch
Ouvrez http: // localhost: 8080 / monaco-editor / test /? Editor = src & monaco-typescript = src à exécuter.

Lancer les tests de l'éditeur
/ src / vscode> npm lance monaco-editor-test
### ou exécuter une page de test http: // localhost: 8080 / monaco-editor / test /? editor = src
Conseil: tous les dossiers doivent être clonés en tant que frères et soeurs.

Conseil: Lors de l’exécution des pages de test, utilisez le panneau de configuration situé dans le coin supérieur droit pour basculer entre l’exécution depuis le source, depuis npm ou depuis la version locale: image

Faire fonctionner le site web
### créer une version locale
/ src / monaco-editor> npm run release

### open http: // localhost: 8080 / monaco-editor / site web /

### construire le site web
/ src / monaco-editor> npm run website

### ouvert http: // localhost: 8080 / monaco-editor-website /

### publier le site web
/ src / monaco-editor-website> origine git push gh-pages --force
Envoi d'un nouveau module npm Monaco-Editor
1. Expédiez un nouveau module monaco-editor-core npm
Bump version dans /src/vscode/build/monaco/package.json
[important] transmettez toutes les modifications locales à la télécommande pour obtenir un bon identifiant de validation public.
générer le paquet npm / src / vscode> noeud_modules / .bin / gulp editor-distro
publier le package npm / src / vscode / out-monaco-editor-core> npm publish
2. Adopter le nouveau monaco-editor-core dans les plugins
si des modifications d’API intempestives affectent les plug-ins de langue, adoptez la nouvelle API dans:
repo - monaco-typescript
repo - monaco-languages
repo - monaco-css
repo - monaco-json
repo - monaco-html
publiez les nouvelles versions de ces plugins sur npm si nécessaire.
3. Mettre à jour package.json
éditez /src/monaco-editor/package.json et mettez à jour la version (si nécessaire):
npm - monaco-editor-core
npm - monaco-typescript
npm - monaco-languages
npm - monaco-css
npm - monaco-json
npm - monaco-html
[important] récupérez les derniers dépôts en exécutant / src / monaco-editor> npm install.
4. Générez et essayez la version locale
/ src / monaco-editor> npm run release
essayez autant de pages de test que vous pensez pertinentes. par exemple.:
ouvrir http: // localhost: 8080 / monaco-editor / test /? editor = releaseDev
ouvrir http: // localhost: 8080 / monaco-editor / test /? editor = releaseMin
ouvrir http: // localhost: 8080 / monaco-editor / test / smoketest.html? editor = releaseDev
ouvrir http: // localhost: 8080 / monaco-editor / test / smoketest.html? editor = releaseMin
5. Mettre à jour la note de version.
API Change / Breaking Change / Nouveau et remarquable
Je vous remercie
6. Publier
/ src / monaco-editor> npm version minor
/ src / monaco-editor / release> npm publish
/ src / monaco-editor> git push --tags
