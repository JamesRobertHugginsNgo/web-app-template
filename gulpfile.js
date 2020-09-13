const del = require('del');
const gulp = require('gulp');
const nodeSass = require('node-sass');
const path = require('path');

const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpBabel = require('gulp-babel');
const gulpCleanCss = require('gulp-clean-css');
const gulpConnect = require('gulp-connect');
const gulpEsLint = require('gulp-eslint');
const gulpPreprocess = require('gulp-preprocess');
const gulpSass = require('gulp-sass');
const gulpLess = require('gulp-less');
const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');

gulpSass.compiler = nodeSass;

const dist = path.join(__dirname, './dist');
function delDist() {
	return del(dist);
}

const preprocessContext = {};

// Build HTML
const buildHtmlSrc = path.join(__dirname, './src/**/*.html');
function buildHtml() {
	return gulp.src(buildHtmlSrc, { since: gulp.lastRun(buildHtml) })
		.pipe(gulpPreprocess({ context: preprocessContext }))
		.pipe(gulp.dest(dist))
		.pipe(gulpConnect.reload());
}
function watchHtml() {
	gulp.watch(buildHtmlSrc, buildHtml);
	return Promise.resolve();
}

function buildCssCommon(stream, dist) {
	return stream
		.pipe(gulpAutoprefixer())
		.pipe(gulp.dest(dist))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpCleanCss())
		.pipe(gulpRename(path => path.basename += '.min'))
		.pipe(gulpSourcemaps.write('./'))
		.pipe(gulp.dest(dist))
		.pipe(gulpConnect.reload());
}

// Build CSS
const buildCssSrc = path.join(__dirname, './src/**/*.css');
function buildCss() {
	const stream = gulp.src(buildCssSrc, { since: gulp.lastRun(buildCss) })
		.pipe(gulpPreprocess({ context: preprocessContext }));

	return buildCssCommon(stream, dist);
}
function watchCss() {
	gulp.watch(buildCssSrc, buildCss);
	return Promise.resolve();
}

// Build SASS
const buildSassSrc = path.join(__dirname, './src/**/*.scss');
function buildSass() {
	const stream = gulp.src(buildSassSrc, { since: gulp.lastRun(buildSass) })
		.pipe(gulpPreprocess({ context: preprocessContext }))
		.pipe(gulpSass().on('error', gulpSass.logError));

	return buildCssCommon(stream, dist);
}
function watchSass() {
	gulp.watch(buildSassSrc, buildSass);
	return Promise.resolve();
}

// Build Less
const buildLessSrc = path.join(__dirname, './src/**/*.less');
function buildLess() {
	const stream = gulp.src(buildLessSrc, { since: gulp.lastRun(buildLess) })
		.pipe(gulpPreprocess({ context: preprocessContext }))
		.pipe(gulpLess());

	return buildCssCommon(stream, dist);
}
function watchLess() {
	gulp.watch(buildLessSrc, buildLess);
	return Promise.resolve();
}

const buildEs6ModuleSrc = path.join(__dirname, './src/**/*.mjs');

// Build ES6 Module
function buildEs6Module() {
	const buildEs6ModulePreprocessContext = Object.assign({
		renderExport(...args) {
			return `export { ${args.join(', ')} };`;
		},
		renderImport(...args) {
			const lastIndex = args.length - 1;
			return `import { ${args.filter((value, index) => index < lastIndex).join(', ')} } from '${args[lastIndex]}';`;
		}
	}, preprocessContext);

	return gulp.src(buildEs6Src, { since: gulp.lastRun(buildEs6Module) })
		.pipe(gulpRename(path => path.extname = '.js'))
		.pipe(gulpPreprocess({ context: buildEs6ModulePreprocessContext }))
		.pipe(gulpRename(path => path.extname = '.mjs'))
		.pipe(gulp.dest(dist))
		.pipe(gulpEsLint({ parserOptions: { sourceType: 'module' } }))
		.pipe(gulpEsLint.format())
		.pipe(gulpEsLint.failAfterError())
		.pipe(gulp.dest(dist))
		.pipe(gulpConnect.reload());
}
function watchEs6Module() {
	gulp.watch(buildEs6Src, buildEs6Module);
	return Promise.resolve();
}

const buildEs6Src = [
	path.join(__dirname, './src/**/*.js'),
	buildEs6ModuleSrc
];

// Build ES6 + ES5
function buildEs6() {
	const buildEs6PreprocessContext = Object.assign({
		renderExport(...args) {
			return `/* exported ${args.join(' ')} */`;
		},
		renderImport(...args) {
			const lastIndex = args.length - 1;
			return `/* global ${args.filter((value, index) => index < lastIndex).join(' ')} */`;
		}
	}, preprocessContext);

	return gulp.src(buildEs6Src, { since: gulp.lastRun(buildEs6) })
		.pipe(gulpRename(path => path.extname = '.js'))
		.pipe(gulpPreprocess({ context: buildEs6PreprocessContext }))
		.pipe(gulp.dest(dist))
		.pipe(gulpEsLint())
		.pipe(gulpEsLint.format())
		.pipe(gulpEsLint.failAfterError())
		.pipe(gulp.dest(dist))
		.pipe(gulpBabel())
		.pipe(gulpRename(path => path.basename += '.es5'))
		.pipe(gulp.dest(dist))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpUglify())
		.pipe(gulpRename(path => path.basename += '.min'))
		.pipe(gulpSourcemaps.write('./'))
		.pipe(gulp.dest(dist))
		.pipe(gulpConnect.reload());
}
function watchEs6() {
	gulp.watch(buildEs6Src, buildEs6);
	return Promise.resolve();
}

const build = gulp.parallel(buildHtml, buildCss, buildSass, buildLess, buildEs6Module, buildEs6);
module.exports.build = gulp.series(delDist, build);

const watch = gulp.parallel(watchHtml, watchCss, watchSass, watchLess, watchEs6Module, watchEs6);
module.exports.watch = gulp.series(delDist, build, watch);

function serve() {
	gulpConnect.server({
		https: false,
		host: 'localhost',
		port: 8080,
		root: '.',
		livereload: true
	});
	return Promise.resolve();
}
module.exports.serve = gulp.series(delDist, build, gulp.parallel(watch, serve));

module.exports.default = module.exports.build;
