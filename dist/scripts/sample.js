/* global $ */

const foo = (bar) => {
	console.log(bar); // eslint-disable-line no-console
};

$(() => {
	foo('Hello World');
});
