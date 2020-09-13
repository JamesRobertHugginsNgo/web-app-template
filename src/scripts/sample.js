/* @exclude */
/* global $ */
/* @endexclude */
/* @exec renderImport('$', './module-sample.mjs') */

const test = 123; // eslint-disable-line

const fu = (bar) => {
	console.log(bar); // eslint-disable-line no-console
};

$(function() {
	fu('Hello Universe');
});
