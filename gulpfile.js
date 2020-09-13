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

const buildJsSrc = path.join(__dirname, './src/**/*.js');
function buildJsStart() {
	return gulp.src(buildJsSrc, { since: gulp.lastRun(buildJs) })
		.pipe(gulpPreprocess({ context: preprocessContext }))
		.pipe(gulpEsLint())
		.pipe(gulpEsLint.format())
		.pipe(gulpEsLint.failAfterError());
}
function buildJsEnd() {
	return gulp.src(buildJsSrc, { since: gulp.lastRun(buildJs) })
		.pipe(gulpConnect.reload());
}

// Build ES6
function buildEs6() {
	return gulp.src(buildJsSrc, { since: gulp.lastRun(buildEs6) })
		.pipe(gulp.dest(dist));
}

// Build ES5
function buildEs5() {
	return gulp.src(buildJsSrc, { since: gulp.lastRun(buildEs5) })
		.pipe(gulpBabel())
		.pipe(gulpRename(path => path.basename += '.es5'))
		.pipe(gulp.dest(dist))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpUglify())
		.pipe(gulpRename(path => path.basename += '.min'))
		.pipe(gulpSourcemaps.write('./'))
		.pipe(gulp.dest(dist));
}

const buildJs = gulp.series(buildJsStart, gulp.parallel(buildEs6, buildEs5), buildJsEnd);

function watchJs() {
	gulp.watch(buildJsSrc, buildJs);
	return Promise.resolve();
}

const build = gulp.parallel(buildHtml, buildCss, buildSass, buildLess, buildJs);
module.exports.build = gulp.series(delDist, build);

const watch = gulp.parallel(watchHtml, watchCss, watchSass, watchLess, watchJs);
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
