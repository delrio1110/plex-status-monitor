var menubar = require('menubar')
var electron = require('electron')
var Menu = electron.Menu;
var BrowserWindow = electron.BrowserWindow
var Dialog = electron.dialog
var app = electron.app
var appName = app.getName()
var hashHistory = require('react-router').hashHistory
// var settings = require('electron-settings');
var storage = require('electron-json-storage')

//CLEAR STORAGE
// storage.clear(function(error) {
//   if (error) throw error;
// });

storage.set('settings', { 
  refreshRate: 30000,
  showDockIcon: false,
  startOnLogin: false,
  rememberLogin: false,
  appState: {
    isActive: false,
    userCount: 0,
    plexServerPort: ':32400',
    loggedIn: false,
    debug: false
  },
  userData: {
    username: '',
    password: '',
  }
}, function(error) {
  if (error) throw error;
});

storage.getAll(function(error, data) {
  if (error) throw error;

  console.log('STORAGE DATA', data);
});


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
          // Dialog.showMessageBox({
          //   title: `About ${appName}`,
          //   message: `${appName} ${app.getVersion()}`,
          //   detail: 'Created by Kevin Knopp',
          //   icon: 'images/app-icon.png',
          //   buttons: []
          // });
        }
      },
      {
        label: 'Preferences...',
        click: function() {
          mb.showWindow()
          mb.window.send('settings-click');
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
    mb.window.send('app-settings');
  });
  // mb.window.addDevToolsExtension('/Users/kevinknopp/Library/Application Support/Google/Chrome/' + 'default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.3_0');
  mb.tray.setPressedImage('IconPressed.png')
  mb.app.dock.setIcon('images/app-icon.png')
  // console.log(mb.window)
  setTimeout(function() {
    // console.log(mb.window)
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
