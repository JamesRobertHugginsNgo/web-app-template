# web-app-template v2.2.1

A [repository template](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) for quickly starting web app projects.

## Features

- Editor Config for your editor
- ESLint to catch JavaScript code errors
	- NodeJS configuration at the root folder
	- ES6 configuration at the __src__ folder
	- ES6 Modules configuration at the __module__ folder
- GulpJS tasks for automation
- GulpJS build task moving code from from __src__ folder to __dist__ folder
	- Moves html files
	- Build CSS files from Less files
	- Build CSS files from SASS files
	- Add prefix to CSS fules in the CSS files
	- ESLint JavaScript files
	- Build the compatible version (using Babel) of the JavaScript files
	- Build the ES6 module JavaScript files
	- Build the compatible version (using Babel) of the ES6 module JavaScript files
	- Build the minified version of the CSS and JavaScript files and their corresponding source files
- GulpJS watch task
	- Executes build task
	- Watches for changes and re-run the build task
- GulpJS serve task
	- Executes watch task
	- Starts a local http server for viewing the web application on a web browser

## Requirment

- [NodeJS and NPM](https://nodejs.org/en/)

## Getting Started

### 1 - Install Dependencies

Dependecies are defined in the _package.json_ file.

```
npm install
```

### 2 - Add/Remove/Update Code

Add code inside the __src__ folder.

### 3a - Build Automation

```
gulp build
```

### 3b - Watch Automation

```
gulp watch
```

### 3c - Serve Automation

```
gulp serve
```


## Dev Dependencies

``` json
{
	"@babel/core": "^7.11.6",
	"@babel/preset-env": "^7.11.5",
	"del": "^5.1.0",
	"eslint": "^7.9.0",
	"gulp": "^4.0.2",
	"gulp-autoprefixer": "^7.0.1",
	"gulp-babel": "^8.0.0",
	"gulp-clean-css": "^4.3.0",
	"gulp-connect": "^5.7.0",
	"gulp-eslint": "^6.0.0",
	"gulp-less": "^4.0.1",
	"gulp-preprocess": "^3.0.3",
	"gulp-rename": "^2.0.0",
	"gulp-sass": "^4.1.0",
	"gulp-sourcemaps": "^2.6.5",
	"gulp-uglify": "^3.0.2",
	"gulp-uglify-es": "^2.0.0",
	"node-sass": "^4.14.1",
	"path": "^0.12.7"
}
```

## NPM Scripts

- build
- watch
- serve
