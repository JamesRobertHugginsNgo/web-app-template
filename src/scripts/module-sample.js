const foo = (bar) => {
	console.log(bar); // eslint-disable-line no-console
};

/* @exclude */
/* exported foo */
/* @endexclude */
/* @exec renderExport('foo') */
