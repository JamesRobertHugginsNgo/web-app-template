"use strict";

/* global $ */
var foo = function foo(bar) {
  console.log(bar); // eslint-disable-line no-console
};

$(function () {
  foo('Hello World');
});