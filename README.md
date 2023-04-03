# Exercism `Purescript` track setup
https://exercism.org/tracks/purescript

### The goal
* Uses local `spago` and `purescript` libraries.
* Prevents the downloading of equal packages in every exercise folder.

### The usage
* Requirements: `exercism-cli` https://exercism.org/cli-walkthrough.
* Install npm dependencies `npm i`
* Add an exercise with `npm run addex <exercise>` (for example, `pangram`)
* Go in the exercise folder `cd exercises/<exercise>`
* Run test `npm test`

### Npm scripts
#### exercise
* `npm addex <exercise>` consists of other three `npm` scripts:
* `npm ex-download <exercise>` - downloads the exercise into `exericsm workspace` folder 
(in this case, `<exercism-workspace>/purescript/<exercise>`)
* `npm ex-move <exercise>` - moves the exercise folder to `./exercises/<exercise>`
* `npm ex-link <exercise>` - adds `./exercises/<exercise>/{.spago,output}` links 
to `./.spago` and `./output` folders.
#### vscode
* `npm run vscode-workspace` creates (if not exists) vscode workspace file in `./.vscode/`
with `./exercises/*` sub-folders, updates `settings.purescript.pursExe` to `./node_modules/.bin/purs`. 
#### idea
* open the `.` folder
