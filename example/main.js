var menubar = require('menubar')
require('electron-debug')({
    showDevTools: true
});
var handlebars = require('handlebars');
// var jsdom = require("jsdom");
// var $ = require("jquery")
// var cheerio = require('cheerio');
// In main process.



var opts = {
  width: 500,
  height: 500
}

var mb = menubar(opts)

mb.on('ready', function ready () {
  console.log('app is ready')
  mb.setOption('icon', 'IconActive.png');
}).setOption('icon', 'IconActive.png')
console.log('NOT READY')
// mb.setOption('icon', 'IconActive.png');
// mb.setOption('icon', 'IconTemplate.png');
// mb.setOption('icon', 'IconActive.png');
// mb.setOption('icon', 'IconTemplate.png');

setTimeout(function() {
  mb.setOption('icon', 'IconActive.png');
  console.log('CHANGE APP ICON')
}, 10000)


var ipcMain = require('electron').ipcMain;
  ipcMain.on('asynchronous-message', function(event, message) {
    console.log(message);  // prints "ping"
    if (message) {
      
      setTimeout(function() {
        mb.setOption('icon', 'IconActive.png')
        console.log('Set Active Icon')
      }, 5000)
      console.log(mb.getOption('icon'))
      console.log('ACTIVE APP')
    }
    else {
      setTimeout(function() {
        mb.setOption('icon', 'IconTemplate.png')
        console.log('Set Normal Icon')
      }, 5000)
      console.log(mb.getOption('icon'))
      console.log('InACTIVE APP')
    }
  });

  ipcMain.on('synchronous-message', function(event, message) {
    console.log(message);  // prints "ping"
    

    event.returnValue = 'pong';
  });
