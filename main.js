var Nightmare = require('nightmare');
var S = require('string');
var async = require('async');
var winston = require('winston');
var tabletojson = require('tabletojson');
var _ = require('lodash');

winston.add(winston.transports.File, {
    filename: './output.csv',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
});

var url = 'url';
var tableSelector = 'selector';
var records = [];

var main = function() {
  var pages = [];
  for (var i = 30; i < 4138; i = i + 30) {
    pages.push(url + i);
  }
  console.log(pages);
  async.eachSeries(pages, nightmareGoto, function (err) {
    console.log('done', err);
  });
};

var nightmareGoto = function(page, callback) {
  var nightmare = Nightmare({
    show: false,
    webPreferences: {
      partition: 'nopersist',
    }
  });

  nightmare.goto(page);
  nightmare
    .evaluate(function () {
      return document.querySelector(selector).outerHTML;
    })
    .then(function(result) {
      var tablesAsJson = tabletojson.convert(result);
      _.forEach(tablesAsJson[0], function(item) {
        if (item.Open) {
          winston.info(item);
        }
      });
    })
    .then(function() {
      callback();
    });

    nightmare.end();
};

main ();
