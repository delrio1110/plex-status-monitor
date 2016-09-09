var menubar = require('menubar')
var electron = require('electron')
var Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow

require('electron-debug')({
  showDevTools: true
});


var opts = {
  width: 500,
  height: 700,
  useContentSize: true,
  transparent: true,
  frame: false,
  y: 30,
  tooltip: 'Plex Status Monitor',
  icon: 'IconTemplate.png',
  resizable: true,
  showDockIcon: true
}

var mb = menubar(opts)

mb.on('ready', function ready () {
  console.log('app is ready')
  // mb.setOption('icon', 'IconActive.png');
  // console.log(mb.window)
  mb.tray.on('right-clicked', function(){
    var contextMenu = Menu.buildFromTemplate([
      {
        label: 'About Plex Status Monitor',
        click: function() {
          new BrowserWindow()
        }
      },
      {
        label: 'Preferences...',
        click: function() {
          new BrowserWindow()
        }
      },
      {
        label: 'Quit',
        click: function() {
          mb.app.quit()
        }
      }
    ])
    mb.tray.popUpContextMenu(contextMenu);
  });
  // mb.window.addDevToolsExtension('/Users/kevinknopp/Library/Application Support/Google/Chrome/' + 'default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.3_0');
  mb.tray.setPressedImage('IconPressed.png')
  mb.app.dock.setIcon('images/app-icon.png')
  console.log(mb.window)
  setTimeout(function() {
    console.log(mb.window)
  }, 5000)
})


var ipcMain = require('electron').ipcMain;
  ipcMain.on('asynchronous-message', function(event, appState) {
    console.log('appstate: ', appState);  // prints "ping"
    if (appState.isActive) {

      mb.tray.setImage('IconActive.png')
      mb.tray.setPressedImage('IconPressed.png')
      mb.tray.setTitle(appState.userCount.toString())
      mb.app.dock.setBadge(appState.userCount.toString())
    }
    else {
       mb.tray.setImage('IconTemplate.png')
       mb.tray.setPressedImage('IconPressed.png')
       mb.tray.setTitle('')
       mb.app.dock.setBadge('')
    }
  });

  ipcMain.on('synchronous-message', function(event, message) {
    console.log(message);  // prints "ping"
    event.returnValue = 'electron sync connected'; // prints pong
  });
