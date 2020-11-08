/* global $ */

/* @exclude */
import { fu } from './export-sample.mjs';
/* @endexclude */
/* @exec renderImport('fu', './export-sample.mjs') */

$(() => {
	fu('Universe');
});
