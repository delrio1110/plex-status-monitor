var Handlebars = require('handlebars');
window.jQuery = window.$ = require('jquery');

var $un = $('#username')
var $pass = $('#password')
var $serverId = $('#server-id')
var token
var serverInterval = 1000 * 60 * 1; // last digit is number of minutes to ping server
var url = 'http://71.84.24.194:32400';

// Changes XML to JSON
function xmlToJson(xml) {
  // Create the return object
  var obj = {};
  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
        } else {
            if (typeof(obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
        }
    }
  }
  return obj;
};

function msToTime(duration) {
  var milliseconds = parseInt((duration%1000)/100)
      , seconds = parseInt((duration/1000)%60)
      , minutes = parseInt((duration/(1000*60))%60)
      , hours = parseInt((duration/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function plexQuery(url, token) {
  $.ajax({
    url: url + '/status/sessions'+ '?X-Plex-Token='+token,
    type: 'GET',
    dataType: 'xml'
    // data: {
    //   'X-Plex-Platform': 'MacOSX',
    //   'X-Plex-Platform-Version': '10.10.5',
    //   'X-Plex-Provides': '1',
    //   'X-Plex-Client-Identifier': 'Plex Server Status Monitor',
    //   'X-Plex-Product': 'Plex Server Status Monitor',
    //   'X-Plex-Version': '1.0',
    //   'X-Plex-Device': 'Max OSX',
    //   'X-Plex-Container-Size': '1',
    //   'X-Plex-Container-Start': '0',
    //   'X-Plex-Token': token,
    //   'Accept': 'application/json'
    // }
  })
  .done(function(data) {
    console.log("INFO GET SUCCESS")
    var jsonData = xmlToJson(data)
    console.log(data)
    console.log(jsonData)
    // console.log(jsonData.MediaContainer.Video['@attributes'].art)

    setHandleBarData(url, token, jsonData)
    $('.movie-duration-bar-highlight').width($('.movie-duration-bar-highlight').attr('data-timeline'))

    // $('#test-image').attr('src', url + jsonData.MediaContainer.Video['@attributes'].art + '?X-Plex-Token=' + token);
  })
  .fail(function(data) {
    console.log("error");
    console.log(data);
  })
  .always(function() {
    console.log("complete");
  });
}

function setHandleBarData(url, token, data) {
  var userInfo = [];
  console.log(data.MediaContainer['@attributes'].size)
  if (data.MediaContainer['@attributes'].size == 0) {
    $('#user-section').html('<h1>No Active Users :)</h1>')
    return
  }

  else if (!Array.isArray(data.MediaContainer.Video)) {
    var movieDuration = msToTime(data.MediaContainer.Video['@attributes'].duration)
    var movieOffset = msToTime(data.MediaContainer.Video['@attributes'].viewOffset)
    var movieTimeLeft = ((data.MediaContainer.Video['@attributes'].duration) - (data.MediaContainer.Video['@attributes'].viewOffset))
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
      movieTimeLeft: (movieTimeLeft / (data.MediaContainer.Video['@attributes'].duration)) * 100 + '%'
    })

    var templateSource = $("#active-users").html();
    var template = Handlebars.compile(templateSource);
    var html = template(userInfo);
    $('#user-section').html(html)
  }

  else {
    for (var i=0; i<data.MediaContainer.Video.length; i++) {
      var movieDuration = msToTime(data.MediaContainer.Video[i]['@attributes'].duration)
      var movieOffset = msToTime(data.MediaContainer.Video[i]['@attributes'].viewOffset)
      var movieTimeLeft = ((data.MediaContainer.Video[i]['@attributes'].duration) - (data.MediaContainer.Video[i]['@attributes'].viewOffset))
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
        movieTimeLeft: (movieTimeLeft / (data.MediaContainer.Video[i]['@attributes'].duration)) * 100 + '%'
      })

    }
    var templateSource = $("#active-users").html();
    var template = Handlebars.compile(templateSource);
    var html = template(userInfo);
    console.log("HTMLLL",html, "template source", templateSource, template)
    $('#user-section').html(html)
  }
}

$('.plex-button').click(function() {
  var username = $un.val()
  var password = $pass.val()
  var serverId = $serverId.val()
  // var url = 'http://71.84.24.194:32400';
  console.log('click')


  $.ajax({
    url: 'https://plex.tv/users/sign_in.json',
    type: 'POST',
    dataType: 'json',
    beforeSend: function (json) {
      json.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    },
    data: {
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
    console.log("DONE!!!!", data)
    token = data.user.authentication_token;
    console.log(token)

    // $.ajax({
    //   url: 'https://plex.tv/pms/:/ip',
    //   type: 'GET',
    //   dataType: 'xml',
    //   data: {
    //     'X-Plex-Platform': 'MacOSX',
    //     'X-Plex-Platform-Version': '10.10.5',
    //     'X-Plex-Provides': '1',
    //     'X-Plex-Client-Identifier': 'Plex Server Status Monitor',
    //     'X-Plex-Product': 'Plex Server Status Monitor',
    //     'X-Plex-Version': '1.0',
    //     'X-Plex-Device': 'Max OSX',
    //     'X-Plex-Device-Name': 'Plex Web',
    //     'X-Plex-Token': token,
    //   }
    // })
    // .done(function(data) {
    //   console.log("successful IP");
    //   console.log(data)
    // })
    // .fail(function() {
    //   console.log("error No IP");
    // })
    // .always(function() {
    //   console.log("completed IP");
    // });

    // window.setInterval(plexQuery, setInterval[url, token]);
    plexQuery(url, token)
    $('#login').hide()


  })
  .fail(function(data) {
    console.log("FAIL!!!!", data)
  })
  .always(function() {
    console.log("complete");
  });
});


