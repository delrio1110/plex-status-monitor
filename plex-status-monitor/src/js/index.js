var Handlebars = require('handlebars');
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistroy, History, IndexRoute } from 'react-router'
window.jQuery = window.$ = require('jquery');
import storage from 'electron-json-storage'
import 'parsleyjs'
require('electron-connect').client.create() //FOR GULP

var ipcRenderer = require('electron').ipcRenderer;
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg); // prints "pong"
});

var settings = {
  'isActive' : false,
  'userCount': '0',
  'plexServerPort': ':32400',
  'loggedIn': false
}

//MODULES
const Application = require('./modules/Application');
// const Home = require('./modules/Home');
// const NotFound = require('./modules/NotFound');

// const Application = require('./modules/Application').default
// import Home from './modules/Home'
// import LoginForm from './modules/LoginForm'
// import Header from './modules/Header'
// import NotFound from './modules/NotFound'



var routes = (
  <Router history={browserHistroy}>
    <Route path ='/' component={Application}>
      <IndexRoute component={Home}/>
    </Route>
    <Route path ='*' component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('.main'));

var $userName = $('#username'),
$password = $('#password'),
$logInForm = $('#login'),
$logInButton = $('#login-button'),
$logInButtonText = $('#login-button span'),
$loader = $('.loader'),
$formError = $('.form-error'),
$logOutButton = $('#logout-button');
// var $serverIp = $('#server-ip')
var token
var serverInterval = 1000 * 30; // 30s between server ping
var url = 'http://';
// var ipAddressRef =  '71.84.24.194:32400'

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

function getPlexIp(token) {
  var ip;
  $.ajax({
      url: 'https://plex.tv/api/resources?X-Plex-Token=' + token,
      type: 'GET',
      dataType: 'xml'
    })
    .done(function(data) {
      console.log("Get Plex Ip Done");
      var jsonData = xmlToJson(data)

      //Set Device data to an array in case user has more than 1 server objects
      if (!Array.isArray(jsonData.MediaContainer.Device)) {
        jsonData.MediaContainer.Device = [jsonData.MediaContainer.Device];
      }

      for (var i=0; i < jsonData.MediaContainer.Device.length; i++ ) {
        if (jsonData.MediaContainer.Device[i]['@attributes'].accessToken == token) {
          //Set Connection data to an array in case user has more than 1 connection objects
          if (!Array.isArray(jsonData.MediaContainer.Device[i].Connection)) {
            jsonData.MediaContainer.Device[i].Connection = [jsonData.MediaContainer.Device[i].Connection];
          }

          for ( var j=0; j < jsonData.MediaContainer.Device[i].Connection.length; j++ ) {
            // console.log(jsonData.MediaContainer.Device[i].Connection[j]);
            // console.log(jsonData.MediaContainer.Device[i].Connection[j]['@attributes'].local);

            if (jsonData.MediaContainer.Device[i].Connection[j]['@attributes'].local == '0') {
              ip = jsonData.MediaContainer.Device[i].Connection[j]['@attributes'].uri;
              console.log("MY SERVER IP ADDRESS: ", ip);
              break;
            }
          }
        }
        //Make Another break here if ip variable has a length??
      }

      plexQuery(ip, token);

    })
    .fail(function(data) {
      console.log("FAIL!!!!", data);
    })
    .always(function() {
      console.log("Get Plex Ip Complete");
    });
}

function plexQuery(ip, token) {
  var plexQueryTimeout

  console.log("Logged in? ", settings.loggedIn)
  if (!settings.loggedIn) {
    console.log("BREAKOUT")
    clearTimeout(plexQueryTimeout);
    return false;
  }
  console.log("PLEX QUERY START", ip, token)
  console.log(ip + '/status/sessions'+ '?X-Plex-Token='+ token)
  console.log("SETTINGS: ", settings)
  $.ajax({
    //url: ip + '/status/sessions?X-Plex-Token=' + token,
    url: ip + '/status/sessions',
    type: 'GET',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'X-Plex-Token': token
    }

  })
  .done(function(data) {
    console.log("PLEX QUERY SUCCESS")
    console.log(data);
    // var jsonData = xmlToJson(data)
    // console.log(jsonData)

    setHandleBarData(ip, token, data)
    console.log('LoggedIn: ', settings.loggedIn)
      console.log("PING SERVER EVERY 30 seconds")
      console.log("SERVER INTERVAL:", serverInterval);

      plexQueryTimeout = setTimeout(function() {
        plexQuery(ip, token);
      }, serverInterval);
      // console.log("AFTER TIMEOUT")

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

// function setHandleBarData(url, token, data) {
//   var mediaInfo = [];
//   console.log(data._children);
//   // console.log(data.MediaContainer['@attributes'].size);
//   if (data._children.length < 1) {
//     $('#user-section').html('<i className="icomoon-hipster icon-hipster"></i><h3>No Active Users</h3>')
//     $logOutButton.show();
//     settings.isActive = false;
//     settings.userCount = '0';
//     ipcRenderer.send('asynchronous-message', settings);
//
//     return;
//   }
//
//   else {
//     console.log(data);
//     console.log(data._children);
//
//
//     // if (!Array.isArray(data.MediaContainer.Track)) {
//     //   //IF NOT ARRAY MAKE IT AN ARRAY!
//     //   data.MediaContainer.Track = [data.MediaContainer.Track];
//     // }
//
//     // for (var i=0; i<data._children.length; i++) {
//     //
//     // }
//
//     //MOVIE / TV SHOW DATA
//     // if (!Array.isArray(data.MediaContainer.Video)) {
//     //   //IF NOT ARRAY MAKE IT AN ARRAY!
//     //   data.MediaContainer.Video = [data.MediaContainer.Video];
//     // }
//     for (var i=0; i<data._children.length; i++) {
//       var mediaInfoData = {}
//
//       var mediaDurationinMs = data._children[i].duration
//       var mediaOffsetinMs = data._children[i].viewOffset
//       var mediaDuration = msToTime(mediaDurationinMs)
//       var mediaOffset = msToTime(mediaOffsetinMs)
//
//       var mediaPercentWatched = ((data._children[i].viewOffset) / (data._children[i].duration) * 100)
//       var date = new Date()
//       var mediaCompletionEstimate = new Date(date.setMilliseconds(date.getMilliseconds() + (mediaDurationinMs - mediaOffsetinMs))).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
//
//
//
//       console.log("MOVIE DURATION: ", mediaDuration)
//       console.log("MOVIE WATCHED: ", mediaOffset)
//       console.log(data._children[i]._children)
//       // if (Array.isArray(data._children[i]._children)) {
//         console.log(data._children[i]._children)
//         for (var j=0; j<data._children[i]._children.length; j++) {
//
//           if (data._children[i]._children[j]._elementType == 'User') {
//               mediaInfoData.mediaType = data._children[i]._elementType
//               mediaInfoData.userThumb = data._children[i]._children[j].thumb;
//               mediaInfoData.userName = data._children[i]._children[j].title;
//               mediaInfoData.mediaTitle = data._children[i].title;
//               mediaInfoData.mediaAlbulmTitle = data._children[i].parentTitle;
//               mediaInfoData.mediaAlbulmArtist = data._children[i].grandparentTitle;
//               mediaInfoData.mediaImg = url + data._children[i].art + '?X-Plex-Token=' + token;
//               mediaInfoData.mediaYear = data._children[i].year;
//               mediaInfoData.mediaDuration = mediaDuration;
//               mediaInfoData.mediaOffset = mediaOffset;
//               mediaInfoData.mediaCompletion = mediaCompletionEstimate;
//               mediaInfoData.mediaTimeLeft = mediaPercentWatched + '%';
// //
//               if(data._children[i]._elementType == 'Track') {
//                 mediaInfoData.mediaTypeIsTrack = true;
//               }
//           }
//
//           if (data._children[i]._children[j]._elementType == 'Player') {
//             mediaInfoData.playerTitle = data._children[i]._children[j].title;
//             mediaInfoData.playerState = data._children[i]._children[j].state;
//           }
//
//           if (j == data._children[i]._children.length-1) {
//             mediaInfo.push(mediaInfoData)
//           }
//         } //end inner loop
//         // data._children[i]._children = {data._children[i]._children}
//       // }
//       // mediaInfo.push(mediaInfoData);
//     }// end outer loop
//     var templateSource = $("#active-users").html();
//     var template = Handlebars.compile(templateSource);
//     var html = template(mediaInfo);
//     console.log('======MEDIA INFO=====', mediaInfo)
//     // console.log("HTMLLL",html, "template source", templateSource, template)
//     $('#user-section').html(html)
//     $logOutButton.show();
//     settings.isActive = true
//     settings.userCount = String(i)
//     ipcRenderer.send('asynchronous-message', settings);
//   }
// }

function logOut() {
  console.log('logout');
  $('#user-section').html('');
  $logInForm.show();
  $logOutButton.hide();
  settings.loggedIn = false;
  console.log("Logged in? ", settings.loggedIn);
  settings.isActive = false;
  settings.userCount = 0;
  ipcRenderer.send('asynchronous-message', settings);
}

//RUN ON CLICK

$('#login').parsley({errorsWrapper: '<ul class="parsley-errors-list animated pulse"></ul>'});


$logOutButton.click(function() {
  logOut();
});

$('input').focus(function() {
  if(!$(this).hasClass('icomoon-error')) {
    $(this).prev('.icomoon').addClass('icomoon-focus');
  }
})

$('input').focusout(function() {
  $(this).prev('.icomoon').removeClass('icomoon-focus');
})

$password.parsley().on('field:error', function() {
  console.log('error')
  $password.prev('.icomoon').removeClass('icon-key').addClass('icon-x2 icomoon-error')
  $password.next('.parsley-errors-list').show()
})

$password.parsley().on('field:success', function() {
  console.log('pass success')
  $password.prev('.icomoon').removeClass('icomoon-error icon-x2').addClass('icon-key')
  $password.next('.parsley-errors-list').hide()
})

$userName.parsley().on('field:error', function() {
  console.log('error')
  $userName.prev('.icomoon').removeClass('icon-mail-envelope-closed').addClass('icon-x2 icomoon-error')
  $userName.next('.parsley-errors-list').show()
})

$userName.parsley().on('field:success', function() {
  console.log('username sucssess')
  $userName.prev('.icomoon').removeClass('icomoon-error icon-x2').addClass('icon-mail-envelope-closed')
  $userName.next('.parsley-errors-list').hide()
})
