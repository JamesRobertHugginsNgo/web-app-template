const del = require('del');
const gulp = require('gulp');
const path = require('path');

const gulpConnect = require('gulp-connect');
const gulpPreprocess = require('gulp-preprocess');

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

const build = gulp.parallel(buildHtml);
module.exports.build = gulp.series(delDist, build);

const watch = gulp.parallel(watchHtml);
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
