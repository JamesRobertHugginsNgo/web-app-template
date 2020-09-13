/* global $ */

/* @exclude */
/* global foo */
/* @endexclude */
/* @exec renderImport('foo', './module-sample.js') */

$(function() {
	foo('Hello World');
});
