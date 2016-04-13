'use strict';

var DyfiListFormat = require('list/DyfiListFormat'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var dyfiListFormat,
        markup;

    dyfiListFormat = DyfiListFormat({
      className: 'dyfi-list-format',
      idprefix: 'listview-1'
    })
    markup = dyfiListFormat.format(data.features[0]);

    document.querySelector('#dyfi-list-format-example').innerHTML = markup;
  },
  error: function () {
    document.querySelector('#dyfi-list-format-example').innerHTML = [
      '<p class="alert error">',
        'Failed to format a DYFI list item.',
      '</p>'
    ].join('');
  }
});


