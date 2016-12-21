/* global SCENARIO_MODE, SEARCH_PATH */
'use strict';

var CheckboxOptionsView = require('settings/CheckboxOptionsView'),
    Config = require('latesteqs/LatestEarthquakesConfig'),
    RadioOptionsView = require('settings/RadioOptionsView'),
    Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {};


var SettingsView = function (options) {
  var _this,
      _initialize,

      _autoUpdateEl,
      _config,
      _feedsEl,
      _restrictListToMapEl,
      _listFormatEl,
      _listSortEl,
      _mapLayersEl,
      _mapOverlaysEl,
      _searchButton,
      _searchEl,
      _timezoneEl;


  _this = View(options);
  options = Util.extend({}, _DEFAULTS, options);


  _initialize = function (/*options*/) {
    _config = options.config || Config();
    // initialize the view
    _this.createSkeleton();
    _this.render();

    _this.model.off('change', 'render', _this);
  };

  _this.createSkeleton = function () {
    _this.el.innerHTML =
        '<section class="settings-header"></section>' +
        '<section class="settings-content"></section>' +
        '<section class="settings-footer"></section>';

    _this.header = _this.el.querySelector('.settings-header');
    _this.content = _this.el.querySelector('.settings-content');
    _this.footer = _this.el.querySelector('.settings-footer');

    // create sections
    _autoUpdateEl = document.createElement('section');
    _feedsEl = document.createElement('section');
    _restrictListToMapEl = document.createElement('section');
    _listFormatEl = document.createElement('section');
    _listSortEl = document.createElement('section');
    _mapLayersEl = document.createElement('section');
    _mapOverlaysEl = document.createElement('section');
    _searchEl = document.createElement('section');
    _timezoneEl = document.createElement('section');

    // append sections to _this.content
    _this.content.appendChild(_autoUpdateEl);
    _this.content.appendChild(_feedsEl);
    _this.content.appendChild(_searchEl);
    _this.content.appendChild(_listFormatEl);
    _this.content.appendChild(_listSortEl);
    _this.content.appendChild(_restrictListToMapEl);
    _this.content.appendChild(_mapLayersEl);
    _this.content.appendChild(_mapOverlaysEl);
    _this.content.appendChild(_timezoneEl);
  };

  /**
   * Frees resources associated with this view.
   */
  _this.destroy = Util.compose(function () {
    _searchButton.removeEventListener('click', _this.onSearchButtonClick,
        _this);

    _autoUpdateEl = null;
    _config = null;
    _feedsEl = null;
    _restrictListToMapEl = null;
    _listFormatEl = null;
    _listSortEl = null;
    _mapLayersEl = null;
    _mapOverlaysEl = null;
    _searchButton = null;
    _searchEl = null;
    _timezoneEl = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Renders the view, called on model change
   */
  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderSearchButton();
  };

  _this.renderContent = function () {
    var autoUpdateView,
        feedsView,
        restrictListToMapView,
        listFormatView,
        listSortView,
        mapLayersView,
        mapOverlaysView,
        timezoneView;

    // Auto Update
    if (!SCENARIO_MODE) {
      autoUpdateView = CheckboxOptionsView({
        el: _autoUpdateEl,
        collection: _config.options.autoUpdate,
        model: _this.model,
        title: 'Earthquakes',
        watchProperty: 'autoUpdate'
      });
      autoUpdateView.render();
    }

    // Earthquake Feeds
    feedsView = RadioOptionsView({
      el: _feedsEl,
      collection: _config.options.feed,
      model: _this.model,
      title: SCENARIO_MODE ? 'Scenario Earthquakes' : null,
      watchProperty: 'feed'
    });
    feedsView.render();

    // Filter results to Map
    restrictListToMapView = CheckboxOptionsView({
      el: _restrictListToMapEl,
      collection: _config.options.restrictListToMap,
      model: _this.model,
      watchProperty: 'restrictListToMap'
    });
    restrictListToMapView.render();

    // List Formats
    listFormatView = RadioOptionsView({
      el: _listFormatEl,
      collection: _config.options.listFormat,
      model: _this.model,
      title: 'List Format',
      watchProperty: 'listFormat'
    });
    listFormatView.render();

    // List Sort
    listSortView = RadioOptionsView({
      el: _listSortEl,
      collection: _config.options.sort,
      model: _this.model,
      title: 'List Sort Order',
      watchProperty: 'sort'
    });
    listSortView.render();

    // Map Layers
    mapLayersView = RadioOptionsView({
      el: _mapLayersEl,
      collection: _config.options.basemap,
      model: _this.model,
      title: 'Map Layers',
      watchProperty: 'basemap'
    });
    mapLayersView.render();

    // Map Overlays
    mapOverlaysView = CheckboxOptionsView({
      el: _mapOverlaysEl,
      collection: _config.options.overlays,
      model: _this.model,
      watchProperty: 'overlays'
    });
    mapOverlaysView.render();

    // Time Zone
    if (!SCENARIO_MODE) {
      timezoneView = RadioOptionsView({
        el: _timezoneEl,
        collection: _config.options.timezone,
        model: _this.model,
        title: 'Time Zone',
        watchProperty: 'timezone'
      });
      timezoneView.render();
    }
  };

  _this.renderHeader = function () {
    _this.header.innerHTML = '<h3>Settings</h3>' +
        '<small>Bookmark to return to map/list with the same settings</small>';
  };

  _this.renderSearchButton = function () {
    _searchButton = document.createElement('button');
    _searchButton.addEventListener('click', _this.onSearchButtonClick, _this);
    _searchButton.classList.add('search-button');
    _searchButton.classList.add('blue');
    _searchButton.innerHTML = 'Search Earthquake Catalog';
    _searchEl.appendChild(_searchButton);
  };

  _this.onSearchButtonClick = function () {
    var hash;

    if (SCENARIO_MODE) {
      hash = _this.parseScenarioHash(Util.extend({}, _this.model.get('feed')));
    } else {
      hash = window.location.hash;
    }

    window.location = SEARCH_PATH + hash;
  };

  /**
   * Turn the scenario feed into a search object
   *
   * @param feed {Object}
   *        _this.model.get('feed'), the currently selected feed object
   * 
   * @return {String}
   *        The settings hash to load on the search page
   */
  _this.parseScenarioHash = function (feed) {
    var obj;

    try {
      // unpack the URL and replace the search object with the feed object
      obj = JSON.parse(decodeURIComponent(window.location.hash.substr(1)));
      feed.id = new Date().getTime();
      obj.search = feed;

      return '#' +  encodeURIComponent(JSON.stringify(obj));
    } catch (e) {
      return window.location.hash;
    }
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = SettingsView;
