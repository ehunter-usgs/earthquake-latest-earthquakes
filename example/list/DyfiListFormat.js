'use strict';

var DyfiListFormat = require('list/DyfiListFormat'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: '/etc/TODO.json',
  success: function (eventData) {
    var item;

    item = null;
    item = DyfiListFormat({
      'data': eventData 
    }).format();

    document.querySelector('#dyfi-list-format-example').innerHTML = item;
  },
  error: function () {
    document.querySelector('#dyfi-list-format-example').innerHTML = [
      '<p class="alert error">',
        'Failed to format a DYFI list item.',
      '</p>'
    ].join('');
  }
});


