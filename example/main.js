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
  height: 500,
  transparent: true,
  y: 27,
  tooltip: 'Plex Activity Monitor'
}

var mb = menubar(opts)

mb.on('ready', function ready () {
  console.log('app is ready')
  mb.setOption('icon', 'IconActive.png');
  mb.tray.setPressedImage('IconPressed.png')
})


var ipcMain = require('electron').ipcMain;
  ipcMain.on('asynchronous-message', function(event, appState) {
    console.log(appState);  // prints "ping"
    if (appState.isActive) {

      mb.tray.setImage('IconActive.png')
      mb.tray.setPressedImage('IconPressed.png')
      mb.tray.setTitle(appState.userCount)
      console.log(mb.getOption('icon'))
      console.log('ACTIVE APP')
    }
    else {
       mb.tray.setImage('IconTemplate.png')
       mb.tray.setPressedImage('IconPressed.png')
       mb.tray.setTitle('')
      console.log('InACTIVE APP')
    }
  });

  ipcMain.on('synchronous-message', function(event, message) {
    console.log(message);  // prints "ping"
    event.returnValue = 'pong';
  });
