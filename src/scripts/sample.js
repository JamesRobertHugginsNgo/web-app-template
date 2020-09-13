/* global $ */

/* @exclude */
/* global foo */
/* @endexclude */
/* @exec renderImport('foo', './module-sample.mjs') */

$(function() {
	foo('Hello World');
});
