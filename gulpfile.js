const del = require('del');
const gulp = require('gulp');
const path = require('path');

const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpCleanCss = require('gulp-clean-css');
const gulpConnect = require('gulp-connect');
const gulpPreprocess = require('gulp-preprocess');
const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');

const dist = path.join(__dirname, './dist');
function delDist() {
	return del(dist);
}

const preprocessContext = {};

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

const build = gulp.parallel(buildHtml, buildCss);
module.exports.build = gulp.series(delDist, build);

const watch = gulp.parallel(watchHtml, watchCss);
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
