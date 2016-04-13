'use strict';

var Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {};

var DyfiListFormat = function (options) {
  var _initialize,
      _this,

      _formatter;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _formatter = options.formatter || Formatter();
  };

  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    _formatter = null;
  }, _this.destroy);

  /**
   * Format an item for the list.
   *
   * @param eq {Object}
   *     a feature object (not model) from the summary feed.
   * @return {DOMElement}
   *     dom element with formatted information.
   */
  _this.format = function (/*eq*/) {
    // TODO :: format earthquake with DYFI stylings
  };

  _initialize(options);
  options = null;
  return _this;

};

module.exports = DyfiListFormat;