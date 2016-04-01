var menubar = require('menubar')
require('electron-debug')({
    showDevTools: true
});
var handlebars = require('handlebars');
// var jsdom = require("jsdom");
// var $ = require("jquery")
// var cheerio = require('cheerio');
var mb = menubar()

mb.on('ready', function ready () {
  console.log('app is ready')
})
