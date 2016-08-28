import React from 'react'

export default React.createClass({
  mixins: [History],
  logIn: function (userInfo) {

    //update state
    // storage.set('username', settings.username)
    // storage.set('password', settings.password)
    // $logInButtonText.hide()
    // $loader.show()
    console.log("Login Start");
    this.getPlexToken(userInfo)
  },
  getPlexToken: function(userInfo) {
    console.log(userInfo)
    var _this = this
    $.ajax({
      url: 'https://plex.tv/users/sign_in.json',
      type: 'POST',
      dataType: 'json',
      beforeSend: function (json) {
        json.setRequestHeader ("Authorization", "Basic " + btoa(userInfo.username + ":" + userInfo.password));
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
    .done((data) => {
      console.log("PLEX TOKEN ACQUIRED.", data)
      token = data.user.authentication_token;
      // userSettings.plexToken = token;
      console.log("PLEX TOKEN: ", token);
      // userSettings.loggedIn = true;
      userInfo.token = token
      this.props.updateUserState(userInfo)
      $userName.val('')
      $password.val('')
      $formError.html('').hide();


      // plexQuery(url, token)
      // $('#login').hide()
      this.getPlexIp(token);
    })
    .fail(function(data, textStatus, errorThrown) {
      var responseText = jQuery.parseJSON(data.responseText);

      if(data.status > 399) {
        $formError.show().html(responseText.error);
      }
      console.log("Login Fail!!!!", data)
    })
    .always(function() {
      console.log("Login Ajax finish");
      $loader.hide()
      $logInButtonText.show()
    });
  },

  getPlexIp: function(token) {
    var ip;
    $.ajax({
        url: 'https://plex.tv/api/resources?X-Plex-Token=' + token,
        type: 'GET',
        dataType: 'xml'
      })
      .done((data) => {
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

        this.plexQuery(ip, token);

      })
      .fail(function(data) {
        console.log("FAIL!!!!", data);
      })
      .always(function() {
        console.log("Get Plex Ip Complete");
      });
  },

  plexQuery: function(ip, token) {
    var plexQueryTimeout

    // console.log("Logged in? ", settings.loggedIn)
    // if (!settings.loggedIn) {
    //   console.log("BREAKOUT")
    //   clearTimeout(plexQueryTimeout);
    //   return false;
    // }
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
    .done((data) => {
      console.log("PLEX QUERY SUCCESS")
      console.log(data);
      // var jsonData = xmlToJson(data)
      // console.log(jsonData)

      this.props.addPlexData(data)
      this.History.pushState(null, '/app/')
      // setHandleBarData(ip, token, data)
      console.log('LoggedIn: ', settings.loggedIn)
        console.log("PING SERVER EVERY 30 seconds")
        console.log("SERVER INTERVAL:", serverInterval);

        // plexQueryTimeout = setTimeout(function() {
        //   plexQuery(ip, token);
        // }, serverInterval);
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
  },

  // $password.parsley().on('field:error', function() {
  //   console.log('error')
  //   $password.prev('.icomoon').removeClass('icon-key').addClass('icon-x2 icomoon-error')
  //   $password.next('.parsley-errors-list').show()
  // })

  parsleyCheck: function() {
    this.refs.password.on('field:error', () => {
      console.log('error')
      // this.refs.password-icon.className = 'icomoon icon-x2 icomoon-error')
        // $password.next('.parsley-errors-list').show()
    })
  },
  signIn : function(e) {
    e.preventDefault()
    if($(e.currentTarget).parsley().isValid()) {
      console.log('FORM SUBMIT')
      var userInfo = {
        username: this.refs.username.value,
        password: this.refs.password.value
      }
      this.logIn(userInfo);
    }
  },
  render: function() {
    return (
      <div className="form-wrapper">
        <div className="form-error"></div>
        <form id="login" ref="loginForm" data-parsley-validate onSubmit={this.signIn}>
          <h2>Sign In</h2>
          <div className="input-wrap">
            <div className="input-field">
              <i className="icomoon icon-mail-envelope-closed" ref="username-icon"></i>
              <input type="text" id="username" ref="username" placeholder="Username or Email" required data-parsley-error-message="Username or Email required" />
            </div>
            <div className="input-field">
              <i className="icomoon icon-key" ref="password-icon"></i>
              <input type="password" id="password" ref="password" placeholder="Password" required data-parsley-error-message="Password is required" />
            </div>
          </div>
          <button className="plex-button" type="submit" id="login-button">
            <span>Sign In</span>
            <div className="loader"></div>
          </button>
        </form>
      </div>
    )
  }
});
