'use strict';


var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');


var _DEFAULTS = {
  classPrefix: 'modes-view',
  watchProperty: 'viewModes'
};


var ModesView = function (options) {
  var _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);


  /**
   * Creates content for view.
   *
   * @param obj {Object}
   *    Configuration object
   */
  _this.createCollectionItemContent = function (obj) {
    var icon;

    icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.setAttribute('title', obj.name || 'Icon');
    icon.innerHTML = obj.icon || 'crop_square';

    return icon;
  };

  /**
   * Determines if application is in mobile or desktop mode
   * and then sets the view modes appropriately.
   *
   * @param objs {Array<Object>}
   *    An array of viewModes objects
   */
  _this.setSelected = function (objs) {
    if (!objs) {
      return;
    }

    if (_this.mobileCheck()) {
      _this.setSelectedMobile(objs);
    } else {
      _this.setSelectedDesktop(objs);
    }
  };

  /**
   * Sets the selected class on each viewMode for desktop
   *
   * @param objs {Array<Object>}
   *    An array of viewModes objects
   */
  _this.setSelectedDesktop = function (objs) {
    objs.forEach(function (obj) {
      _this.setSelectedViewMode(obj);
    });
  };

  /**
   * Sets the selected class on one viewMode for mobile, and
   * updates 'viewModes' on the model.
   *
   * Loops through all of the selected view modes and sets the most
   * "preferred" view mode. Only one view mode can be selected on mobile.
   *
   * @param objs {Array<Object>}
   *    An array of viewModes objects
   */
  _this.setSelectedMobile = function (objs) {
    var done,
        mode,
        modeOrder,
        obj;

    done = false;
    modeOrder = [
      'list',
      'map',
      'settings',
      'help'
    ];

    if (objs.length === 1) {
      _this.setSelectedViewMode(objs[0]);
      return;
    }

    // loop through mode in the preferred order
    for (var i = 0; i < modeOrder.length; i++) {
      mode = modeOrder[i];

      for (var x = 0; x < objs.length; x++) {
        obj = objs[x];

        if (mode === obj.id) {
          // set selected
          _this.updateMobileModel(obj);
          // exit loop
          done = true;
          break;
        }
      }

      if (done) {
        break;
      }
    }
  };

  /**
   * Adds the "selected" class to view modes when selected.
   *
   * @param obj {Object}
   *    An object with an "id" attribute corresponding to the
   *    "data-id" attribute of some element in `_this.content`.
   */
  _this.setSelectedViewMode = function  (obj) {
    var el,
        id;

    id = obj.id;
    el = _this.content.querySelector('[data-id="' + id + '"]');

    if (el) {
      el.classList.add('selected');
    }
  };

  /**
   * Checks the size of the browser window to see if it is in a mobile
   * environment or not.
   */
  _this.mobileCheck = function () {
    var mobile,
        mobileWidth,
        width;

    mobile = false;
    mobileWidth = 641;
    width = window.innerWidth || document.body.clientWidth;

    if (width <= mobileWidth) {
      mobile = true;
    }

    return mobile;
  };

  /**
   * Update model based on newly clicked item in the options view. If
   * the clicked item was previously set as a value on the `watchProperty` for
   * `_this.model` then that item is removed from the `watchProperty` value;
   * otherwise the item is added to the `watchProperty` value.
   *
   * This method is called by updateModel.
   *
   * @param obj {Object}
   *    Configuration option that was clicked
   */
  _this.updateDesktopModel = function (obj) {
    var i,
        index,
        items,
        properties,
        toSet;

    if (obj.id === 'help') {
      _this.model.set({
        'viewModes': [
          {
            'id': 'help'
          }
        ]
      });
      return;
    }

    toSet = {};
    properties = _this.model.get(_this.watchProperty);

    if (properties) {
      items = properties.slice(0);
    } else {
      items = [];
    }

    index = -1;
    toSet[_this.watchProperty] = [];
    // check if model already contains selected object
    for (i = 0; i < items.length; i++) {
      if (obj.id !== items[i].id && items[i].id !== 'help') {
        // contains object, remove it
        toSet[_this.watchProperty].push(items[i]);
      } else if (obj.id === items[i].id) {
        index = i;
      }
    }

    if (index === -1) {
      // does not contain object, add it
      toSet[_this.watchProperty].push(obj);
    } else if (toSet[_this.watchProperty].length === 0) {
      toSet[_this.watchProperty].push({'id': 'help'});
    }

    _this.model.set(toSet);
  };

  /**
   * updates model based on view port size.
   *
   * @param obj {Object}
   *     Configuration option that was clicked
   */
  _this.updateModel = function (obj) {
    if (_this.mobileCheck()) {
      _this.updateMobileModel(obj);
    } else {
      _this.updateDesktopModel(obj);
    }
  };

  /**
   * Updates the model with the selected mode and deselects other modes.
   *
   * @param obj {Object}
   *    Configuration option that was clicked
   */
  _this.updateMobileModel = function (obj) {
    _this.model.set({'viewModes': [obj]});
  };


  options = null;
  return _this;
};


module.exports = ModesView;
