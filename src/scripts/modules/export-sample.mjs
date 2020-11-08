const { fu } = (() => {
	const prefix = 'Hello'; // Private

	const fu = (bar) => {
		console.log(prefix, bar); // eslint-disable-line no-console
	};

	return { fu };
})();

/* @exclude */
export { fu };
/* @endexclude */
/* @exec renderExport('fu') */
