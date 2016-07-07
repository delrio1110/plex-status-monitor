var Handlebars = require('handlebars');
window.jQuery = window.$ = require('jquery');
var storage = require('electron-json-storage');
// var menubar = require('menubar')
// var mb = menubar()
var ipcRenderer = require('electron').ipcRenderer;
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg); // prints "pong"
});


//TODO
//GET PlexQuery ajax call working


var $un = $('#username')
var $pass = $('#password')
// var $serverIp = $('#server-ip')
var token
var serverInterval = 1000 * 30 * 1; // last digit is number of minutes to ping server
var url = 'http://';
// var ipAddressRef =  '71.84.24.194:32400'

var settings = {
  'isActive' : false,
  'userCount': '0',
  'plexServerPort': ':32400',
  'loggedIn': false
}

// storage.has('username', function(error, hasKey) {
//   if (error) throw error;
//
//   if (hasKey) {
//     console.log('SETTINGS HAVE BEEN SAVED');
//     storage.get('username', function(error,data) {
//       if (error) throw error;
//       else { settings.username = data }
//         console.log(data)
//     })
//     storage.get('password', function(error,data) {
//       if (error) throw error;
//       else { settings.password = data }
//         console.log('password here')
//     })
//     storage.get('server', function(error,data) {
//       if (error) throw error;
//       else { settings.serverIp = url + data }
//         console.log(data)
//         console.log(settings.serverIp)
//     })
//     console.log(settings)
//     setTimeout(function() {
//       getPlexToken(settings)
//       console.log("SET TIMEOUT")
//     }, 5000)
//   }
// });

function plexQuery(ip, token) {
  console.log("PLEX QUERY START", ip, token)
  console.log(ip + '/status/sessions'+ '?X-Plex-Token='+ token)
  console.log("SETTINGS: ", settings)
  $.ajax({
    //url: ip + '/status/sessions'+ '?X-Plex-Token='+ token,
    url: ip + '/status/sessions' + '?X-Plex-Token=' + token,
    type: 'POST',
    dataType: 'xml'
    // headers: {'X-Plex-Token': token}
  })
  .done(function(data) {
    console.log("PLEX QUERY SUCCESS")
    var jsonData = xmlToJson(data)
    console.log(data)
    console.log(jsonData)
    // console.log(jsonData.MediaContainer.Video['@attributes'].art)

    setHandleBarData(ip, token, jsonData)
    console.log('LoggedIn: ', settings.loggedIn)
    while (settings.loggedIn) {
        console.log("PING SERVER EVERY 30 seconds")
        setTimeout(plexQuery(ip, token), serverInterval);
    }

    // $('#test-image').attr('src', url + jsonData.MediaContainer.Video['@attributes'].art + '?X-Plex-Token=' + token);
  })
  .fail(function(data) {
    console.log("PLEX QUERY ERROR!");
    console.log(data);
  })
  .always(function() {
    console.log("PLEX QUERY RUN");
  });
}

function getPlexToken(userSettings) {
  $.ajax({
      url: 'https://plex.tv/users/sign_in.json',
      type: 'POST',
      dataType: 'json',
      beforeSend: function (json) {
        json.setRequestHeader ("Authorization", "Basic " + btoa(userSettings.username + ":" + userSettings.password));
      },
      headers: {
        'X-Plex-Platform': 'MacOSX',
        'X-Plex-Platform-Version': '10.10.5',
        'X-Plex-Provides': '1',
        'X-Plex-Client-Identifier': 'Plex Server Status Monitor',
        'X-Plex-Product': 'Plex Server Status Monitor',
        'X-Plex-Version': '1.0',
        'X-Plex-Device': 'Max OSX',
        'X-Plex-Device-Name': 'Plex Web'
      }
    })
    .done(function(data) {
      console.log("PLEX TOKEN ACQUIRED.", data)
      token = data.user.authentication_token;
      settings.plexToken = token;
      console.log("PLEX TOKEN: ", token);
      settings.loggedIn = true;

      // plexQuery(url, token)
      $('#login').hide()

      getPlexIp(token);
    })
    .fail(function(data) {
      console.log("FAIL!!!!", data)
    })
    .always(function() {
      console.log("Get Plex Token Complete");
    });
}

function getPlexIp(token) {
  var ip;
  $.ajax({
      url: 'https://plex.tv/pms/:/ip',
      type: 'POST',
      headers: {
        'X-Plex-Token': token
      }
    })
    .done(function(data) {
      console.log("PLEX IP ACQUIRED");
      console.log("Server Public IP Address: ", data);
      console.log("dataType: ", typeof(data));
      ip = data;
      ip = ip.replace(/\s+/g, ''); //clear empty space from string
      ip += settings.plexServerPort; //add port to ip
      settings.plexServerIp = ip; // save to settings
      console.log(settings.plexServerIp);

      plexQuery(ip, token);
    })
    .fail(function(data) {
      console.log("FAIL!!!!", data);
    })
    .always(function() {
      console.log("Get Plex Ip Complete");
    });
}

function setHandleBarData(url, token, data) {
  var userInfo = [];
  console.log(data.MediaContainer['@attributes'].size);
  if (data.MediaContainer['@attributes'].size == 0) {
    $('#user-section').html('<h1>No Active Users :)</h1>')
    settings.isActive = false;
    settings.userCount = '0';

    return;
  }

  else if (!Array.isArray(data.MediaContainer.Video)) {
    //|| !Array.isArray(data.MediaContainer.Track) || !Array.isArray(data.MediaContainer.Photo)
    var movieDuration = msToTime(data.MediaContainer.Video['@attributes'].duration)
    var movieOffset = msToTime(data.MediaContainer.Video['@attributes'].viewOffset)
    var moviePercentWatched = ((data.MediaContainer.Video['@attributes'].viewOffset) / (data.MediaContainer.Video['@attributes'].duration) * 100)
    console.log("MOVIE DURATION: ", movieDuration)
    console.log("MOVIE WATCHED: ", movieOffset)
    userInfo.push({
      movieTitle: data.MediaContainer.Video['@attributes'].title,
      userThumb: data.MediaContainer.Video.User['@attributes'].thumb,
      userName: data.MediaContainer.Video.User['@attributes'].title,
      movieImg: url + data.MediaContainer.Video['@attributes'].art + '?X-Plex-Token=' + token,
      movieYear: data.MediaContainer.Video['@attributes'].year,
      movieDuration: movieDuration,
      movieOffset: movieOffset,
      movieTimeLeft: moviePercentWatched+'%'
    })
    // $('.movie-duration-bar-highlight[data-movie-index=' + userInfo[0].movieIndex + ']').width(userInfo[0].movieTimeLeft)

    var templateSource = $("#active-users").html();
    var template = Handlebars.compile(templateSource);
    var html = template(userInfo);
    $('#user-section').html(html)
    settings.isActive = true
    settings.userCount = '1'
  }

  else {
    for (var i=0; i<data.MediaContainer.Video.length; i++) {
      var movieDuration = msToTime(data.MediaContainer.Video[i]['@attributes'].duration)
      var movieOffset = msToTime(data.MediaContainer.Video[i]['@attributes'].viewOffset)
      var moviePercentWatched = ((data.MediaContainer.Video[i]['@attributes'].viewOffset) / (data.MediaContainer.Video[i]['@attributes'].duration) * 100)

      console.log("MOVIE DURATION: ", movieDuration)
      console.log("MOVIE WATCHED: ", movieOffset)
      console.log(data.MediaContainer.Video[i]['@attributes'])
      userInfo.push({
        movieTitle: data.MediaContainer.Video[i]['@attributes'].title,
        userThumb: data.MediaContainer.Video[i].User['@attributes'].thumb,
        userName: data.MediaContainer.Video[i].User['@attributes'].title,
        movieImg: url + data.MediaContainer.Video[i]['@attributes'].art + '?X-Plex-Token=' + token,
        movieYear: data.MediaContainer.Video[i]['@attributes'].year,
        movieDuration: movieDuration,
        movieOffset: movieOffset,
        movieTimeLeft: moviePercentWatched + '%'
      })

    }
    var templateSource = $("#active-users").html();
    var template = Handlebars.compile(templateSource);
    var html = template(userInfo);
    // console.log("HTMLLL",html, "template source", templateSource, template)
    $('#user-section').html(html)
    settings.isActive = true
    settings.userCount = String(i)
  }
}


//RUN ON CLICK
$('.plex-button').click(function() {
  settings.username = $un.val()
  settings.password = $pass.val()
  // settings.serverIp = $serverIp.val()

  storage.set('username', settings.username)
  storage.set('password', settings.password)
  // storage.set('server', settings.serverIp)

  storage.has('username', function(error, hasKey) {
    if (error) throw error;

    if (hasKey) {
      console.log('There is data stored as `username`');
    }
  });

  // var url = 'http://71.84.24.194:32400';
  console.log('click')


  setTimeout(function() {
    getPlexToken(settings)
    console.log("SET TIMEOUT")
  }, 5000)

});
