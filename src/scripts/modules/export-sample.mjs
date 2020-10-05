const fu = (bar) => {
	console.log(bar); // eslint-disable-line no-console
};

/* @exclude */
export { fu };
/* @endexclude */
/* @exec renderExport('fu') */
