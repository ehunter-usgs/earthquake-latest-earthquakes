'use strict';

var Formatter = require('core/Formatter'),
    Util = require('util/Util');

var _DEFAULTS = {};

var _NOT_REPORTED = '&ndash;';

var DyfiListFormat = function (options) {
  var _initialize,
      _this,

      _className,
      _formatter,
      _idprefix,
      _settings;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _formatter = options.formatter || Formatter();
    _className = options.className || null;
    _idprefix = options.idprefix || null;
    _settings = options.settings || null;
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
  _this.format = function (eq) {
    var cdi,
        className,
        felt,
        mmi,
        mmiClass,
        properties,
        responses;

    properties = eq.properties;
    cdi = properties.cdi;
    felt = properties.felt;
    mmi = properties.mmi;

    if (felt !== null) {
      mmi = _formatter.mmi(mmi);
      mmiClass = 'intensity mmi' + mmi;

      if (felt !== 1) {
        responses = felt + ' responses';
      } else {
        responses = felt + ' response';
      }
    } else {
      mmi = _NOT_REPORTED;
      mmiClass = 'no-dyfi';
      responses = _NOT_REPORTED + ' responses';
    }

    if (properties.sig >= 600) {
      className = ' class="bigger"';
    } else if (properties.mag >= 4.5) {
      className = ' class="big"';
    }

    return '<li id="' + _idprefix + eq.id + '"' + className + '>' +
        '<span class="' + mmiClass + '">' +
          cdi +
        '</span> ' +
        '<span class="place">' +
          properties.title +
        '</span> ' +
        '<span class="time"> ' +
          _formatter.datetime(properties.time) +
        '</span> ' +
        '<span class="responses">' +
          responses +
        '</span>' +
      '</li>';
  };

  _initialize(options);
  options = null;
  return _this;

};

module.exports = DyfiListFormat;