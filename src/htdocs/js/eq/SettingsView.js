/* global define */
define([
	'mvc/Util',
	'mvc/View',
	'mvc/Events',
	'eq/SettingView',
	'eq/ToggleSettingView',
	'eq/Format'
], function(
	Util,
	View,
	Events,
	SettingView,
	ToggleSettingView,
	Format
) {
	'use strict';


	var SettingsView = function(options) {
		Events.call(this);
		View.call(this, options);
		this._el.className = 'settingsView';

		var _this = this,
		    _options = options,
		    _initialized = false,
		    _feedView = null,
		    _autoupdateView = null,
		    _sortView = null,
		    _listFormatView = null,
		    _restrictListToMapView = null,
		    _basemapView = null,
		    _overlaysView = null,
		    _timezoneView = null;

		/**
		 * Create the form controls for the settings.
		 */
		var _initialize = function () {
			if (_initialized) {
				return true;
			}

			var section;

			// HEADER
			section = _this._el.appendChild(document.createElement('section'));
			section.innerHTML = '<h2>My Settings</h2>' +
					'<span class="help">' +
						'Bookmark to return to map/list with same settings.' +
					'</span>';


			// EARTHQUAKES
			section = _this._el.appendChild(document.createElement('section'));
			section.appendChild(document.createElement('h3')).innerHTML = 'Earthquakes';

			_autoupdateView = new ToggleSettingView({
				'settings': _options.settings,
				'key': 'autoUpdate',
				'options': [
					{
						'id': 'autoUpdate',
						'name': 'Auto Update'
					}
				]
			});
			section.appendChild(_autoupdateView._el);

			_feedView = new SettingView({
				'settings': _options.settings,
				'key': 'feed',
				'options': function () {
					var feeds = _options.settings.getOptions('feeds') || [],
					    search = _options.settings.get('search');

					// Make a copy
					feeds = feeds.slice(0); // Prevents duplicating searches

					if (search !== null) {
						search.name = 'Search Results';
						feeds.push(search);
					}

					return feeds;
				}
			});
			section.appendChild(_feedView._el);

			var _searchContainer = section.appendChild(
					document.createElement('div'));
			var _searchButton = _searchContainer.appendChild(
					document.createElement('button'));

			Util.addClass(_searchContainer, 'settingsview-searchwrapper');
			Util.addClass(_searchButton, 'settingsview-searchbutton');
			Util.addClass(_searchButton, 'green');

			_searchButton.innerHTML = 'Search Earthquake Archives';

			Util.addEvent(_searchButton, 'click', function () {
				window.location = '/earthquakes/search/' +
						window.location.hash;
			});


			// LIST FORMAT
			section = _this._el.appendChild(document.createElement('section'));
			section.appendChild(document.createElement('h3')).innerHTML = 'List Format';
			_listFormatView = new SettingView({
				'settings': _options.settings,
				'key': 'listFormat',
				'options':_options.settings.getOptions('listFormats')
			});
			section.appendChild(_listFormatView._el);


			// LIST SORT
			section = _this._el.appendChild(document.createElement('section'));
			section.appendChild(document.createElement('h3')).innerHTML = 'List Sort Order';
			_sortView = new SettingView({
				'settings': _options.settings,
				'key': 'sort',
				'options': _options.settings.getOptions('sorts')
			});
			section.appendChild(_sortView._el);

			_restrictListToMapView = new ToggleSettingView({
				'settings': _options.settings,
				'key': 'restrictListToMap',
				'options': [
					{
						'id': 'restrictListToMap',
						'name': 'Only List Earthquakes Shown on Map'
					}
				]
			});
			section.appendChild(_restrictListToMapView._el);


			// MAP LAYERS
			section = _this._el.appendChild(document.createElement('section'));
			section.appendChild(document.createElement('h3')).innerHTML = 'Map Layers';
			_basemapView = new SettingView({
				'settings': _options.settings,
				'key': 'basemap',
				'options': _options.settings.getOptions('basemaps')
			});
			section.appendChild(_basemapView._el);

			_overlaysView = new ToggleSettingView({
				'settings': _options.settings,
				'key': 'overlays',
				'options': _options.settings.getOptions('overlays')
			});
			section.appendChild(_overlaysView._el);


			// TIME ZONE
			section = _this._el.appendChild(document.createElement('section'));
			section.appendChild(document.createElement('h3')).innerHTML = 'Time Zone';
			_timezoneView = new SettingView({
				'settings': _options.settings,
				'key': 'timeZone',
				'options': [
					{
						id: 'utc',
						name: 'UTC'
					},
					{
						id: 'local',
						name: 'Local System Time <small>(UTC' +
								Format.isoTimezone(-1* (new Date()).getTimezoneOffset()) +
								')</small>'
					}
				]
			});
			section.appendChild(_timezoneView._el);


			// DONE
			_initialized = true;
		};


		/**
		 * Updates the controls in settings to reflect what is currently displayed
		 * in the interface.
		 */
		this.render = function () {
			if (!_initialized) {
				_initialize();
			}

			_feedView.render();
			_sortView.render();
			_listFormatView.render();
			_restrictListToMapView.render();
			_basemapView.render();
			_overlaysView.render();
			_timezoneView.render();
		};


	};



	return SettingsView;

});
