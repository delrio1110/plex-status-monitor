var menubar = require('menubar')

require('electron-debug')({
    showDevTools: true
});


var opts = {
  width: 500,
  height: 700,
  transparent: true,
  y: 35,
  tooltip: 'Plex Status Monitor',
  icon: 'IconTemplate.png',
  resizable: true
}

var mb = menubar(opts)

mb.on('ready', function ready () {
  console.log('app is ready')
  // mb.setOption('icon', 'IconActive.png');
  // console.log(mb.window)
  // mb.window.addDevToolsExtension('/Users/kevinknopp/Library/Application Support/Google/Chrome/' + 'default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.3_0');
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
