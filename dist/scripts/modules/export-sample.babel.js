"use strict";

var _ref = function () {
  var prefix = 'Hello'; // Private

  var fu = function fu(bar) {
    console.log(prefix, bar); // eslint-disable-line no-console
  };

  return {
    fu: fu
  };
}(),
    fu = _ref.fu;
/* exported fu */