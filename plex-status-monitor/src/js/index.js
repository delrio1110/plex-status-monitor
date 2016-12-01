import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistroy, hashHistory, IndexRoute } from 'react-router'
import 'parsleyjs'


window.jQuery = window.$ = require('jquery');
// require('electron-connect').client.create() //FOR GULP

var ipcRenderer = window.ipcRenderer;
console.log(ipcRenderer.sendSync('synchronous-message', 'elctron sync start')); // prints "ping"
ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg); // prints "pong"
});

ipcRenderer.on('settings-click', function(event) {
  hashHistory.push('/settings');
});

//MODULES
import Application  from './modules/Application'
import Home from './modules/Home'
import LoginForm from './modules/LoginForm'
import MediaContainer from './modules/MediaContainerXML'
import NotFound from './modules/NotFound'
import NoActiveUsers from './modules/NoActiveUsers'
import Settings from './modules/Settings'

var routes = (
  <Router history={hashHistory}>
    <Route path ='/' component={Application}>
      <IndexRoute component={LoginForm} />
      <Route path ='app' component={MediaContainer} />
      <Route path ='inactive' component={NoActiveUsers} />
      <Route path ='settings' component={Settings} />
      <Route path ='*' component={NotFound} />
    </Route>
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


//RUN ON CLICK

$('#login').parsley({errorsWrapper: '<ul class="parsley-errors-list animated pulse"></ul>'});

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
