"use strict";

/* global $ */
var test = 123; // eslint-disable-line

var fu = function fu(bar) {
  console.log(bar); // eslint-disable-line no-console
};

$(function () {
  fu('Hello Universe');
});