import React from 'react'
import MediaItem from './MediaItem'
import { msToTime } from '../helperFunctions'
import { hashHistory } from 'react-router'
import NoActiveUsers from './NoActiveUsers'
import isOnline from 'is-online'
import { xmlToJson } from '../helperFunctions'
// import ReactTimeout from 'react-timeout'
// console.log(ReactTimeout)
// import TimerMixin from 'react-timer-mixin'
// var TimerMixin = require('react-timer-mixin');

// class Whatever extends React.Compoinent {
//   r
// }


export default React.createClass({
  // mixins: [TimerMixin],
  timeout: null,
  getInitialState: function() {
    return {
      mediaInfo: []
    }
  },
  componentWillMount: function () {
    console.log('COMPONENT WILL MOUNT',this.props)
    this.plexQuery(this.props.userIP, this.props.plexToken)
    this.setPlexData(this.props.plexData, this.props.userIP, this.props.plexToken)
  },
  componentWillReceiveProps: function(props) {
    console.log('COMPONENT WILL RECEIVE PROPS:', props)
    this.setPlexData(props.plexData, props.userIP, props.plexToken)
  },
  addMediaInfo: function(mediaInfoDataList) {
    this.notifyUser(mediaInfoDataList)

    //update User Count for electron app
    this.props.updateUserCount(mediaInfoDataList.length)
    console.log('saving media info', mediaInfoDataList)
    this.setState({mediaInfo: mediaInfoDataList})
  },
  notifyUser: function(newMediaData) {
    console.log('NOTIFICATION TEST')
    console.log(newMediaData)
    console.log(this.state.mediaInfo)
    for (var i = 0; i < newMediaData.length; i++) {
      if(this.state.mediaInfo[i]) {
        if(newMediaData[i].mediaTitle != this.state.mediaInfo[i].mediaTitle) {
          console.log('==============Notification==============')
          new Notification(newMediaData[i].mediaTitle, {
            body: newMediaData[i].userName + ' started playing ' + newMediaData[i].mediaTitle + ' on ' + newMediaData[i].playerTitle,
            silent: true
          });
        }
      } else {
        console.log('==============Notification==============')
        new Notification(newMediaData[i].mediaTitle, {
          body: newMediaData[i].userName + ' started playing ' + newMediaData[i].mediaTitle + ' on ' + newMediaData[i].playerTitle,
          silent: true
        });
      }
    }
  },
  setPlexData: function(data, ip, token) {

    console.log('TEST', data)

    if (Object.keys(data).length === 0) return

    else {
      console.log('SETTING PLEX DATA!', data.MediaContainer['@attributes'].size);
      console.log(data);

      var mediaInfoDataList = []

      //TRACK DATA
      //IF NOT ARRAY MAKE IT AN ARRAY!
      if (!Array.isArray(data.MediaContainer.Track)) {
        data.MediaContainer.Track = [data.MediaContainer.Track];
      }
      for ( var i = 0; i < data.MediaContainer.Track.length; i++ ) {
        let mediaInfoData = this.setPlexDataVariables(data, i, ip, token, 'Track')
        mediaInfoDataList.push(mediaInfoData)
      } 

      //MOVIE / TV SHOW DATA
      //IF NOT ARRAY MAKE IT AN ARRAY!
      if (!Array.isArray(data.MediaContainer.Video)) {
        data.MediaContainer.Video = [data.MediaContainer.Video];
      }
      for ( var i = 0; i < data.MediaContainer.Video.length; i++ ) {
        let mediaInfoData = this.setPlexDataVariables(data, i, ip, token, 'Video')
        mediaInfoDataList.push(mediaInfoData)
      } // end for loop
      this.addMediaInfo(mediaInfoDataList)

    } // end else
  },
  setPlexDataVariables (data, i, ip, token, dataType) {
    var mediaInfoData = {}
    var mediaDurationinMs = data.MediaContainer[dataType][i]['@attributes'].duration
    var mediaOffsetinMs = data.MediaContainer[dataType][i]['@attributes'].viewOffset
    var mediaDuration = msToTime(mediaDurationinMs)
    var mediaOffset = msToTime(mediaOffsetinMs)
    var mediaPercentWatched = ((mediaOffsetinMs) / (mediaDurationinMs) * 100)
    var date = new Date()
    var mediaCompletionEstimate = new Date(date.setMilliseconds(date.getMilliseconds() + (mediaDurationinMs - mediaOffsetinMs))).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})

    console.log("MOVIE DURATION: ", mediaDuration)
    console.log("MOVIE WATCHED: ", mediaOffset)
    console.log(data.MediaContainer[dataType][i]._children)
    console.log(data.MediaContainer[dataType][i]._children)

    if (dataType === 'Track') {
      mediaInfoData.mediaTypeIsTrack = true;
    }

    mediaInfoData.mediaType = data.MediaContainer[dataType][i]['@attributes'].type;
    mediaInfoData.userThumb = data.MediaContainer[dataType][i].User['@attributes'].thumb;
    mediaInfoData.userId =  data.MediaContainer[dataType][i].User['@attributes'].id;
    mediaInfoData.userFriendAvatar = 'https://plex.tv/users/'+ data.MediaContainer[dataType][i].User['@attributes'].id + '/avatar';
    mediaInfoData.userName = data.MediaContainer[dataType][i].User['@attributes'].title;
    mediaInfoData.mediaTitle = data.MediaContainer[dataType][i]['@attributes'].title;
    //Track Grandparent Title Data
    mediaInfoData.mediaAlbulmTitle = data.MediaContainer[dataType][i]['@attributes'].parentTitle;
    mediaInfoData.mediaAlbulmArtist = data.MediaContainer[dataType][i]['@attributes'].grandparentTitle;
    mediaInfoData.mediaImg = ip + data.MediaContainer[dataType][i]['@attributes'].art + '?X-Plex-Token=' + token;
    mediaInfoData.mediaMovieYear = data.MediaContainer[dataType][i]['@attributes'].year;
    //Media Duration Data
    mediaInfoData.mediaDuration = mediaDuration;
    mediaInfoData.mediaOffset = mediaOffset;
    mediaInfoData.mediaCompletion = mediaCompletionEstimate;
    mediaInfoData.mediaTimeLeft = mediaPercentWatched + '%';
    //Player Data
    mediaInfoData.playerTitle = data.MediaContainer[dataType][i].Player['@attributes'].title;
    mediaInfoData.playerState = data.MediaContainer[dataType][i].Player['@attributes'].state;
    return mediaInfoData;
  },
  componentWillUnmount () {
    clearTimeout(this.timeout)
  },
  plexQuery: function(ip, token) {


    console.log("PLEX QUERY START", ip, token)
    console.log(ip + '/status/sessions'+ '?X-Plex-Token='+ token)
    // console.log("SETTINGS: ", settings)

    //check internet connection
    if (navigator.onLine) {
      //true here means connected to network - not necessarily internet
      // $.ajax({
      //   //url: ip + '/status/sessions?X-Plex-Token=' + token,
      //   url: ip + '/status/sessions',
      //   type: 'GET',
      //   dataType: 'json',
      //   headers: {
      //     'Accept': 'application/json',
      //     'X-Plex-Token': token
      //   }
      // })
      $.ajax({
        //url: ip + '/status/sessions?X-Plex-Token=' + token,
        url: ip + '/status/sessions',
        type: 'GET',
        dataType: 'xml',
        headers: {
          'X-Plex-Token': token
        }
      })
      .done((data) => {
        console.log("PLEX QUERY SUCCESS")
        console.log(data);
        var jsonData = xmlToJson(data)
        console.log('jsonData', jsonData)

        this.props.addPlexData(jsonData)
        console.log("PING SERVER EVERY 30 seconds")
         console.log("SERVER INTERVAL:", this.props.serverInterval);

          this.timeout = setTimeout(() => {
            this.plexQuery(ip, token);
          }, this.props.serverInterval);
          console.log("AFTER TIMEOUT")

        // $('#test-image').attr('src', url + jsonData.MediaContainer.Video['@attributes'].art + '?X-Plex-Token=' + token);
      })
      .fail((data) => {
        console.log("PLEX QUERY ERROR!");
        console.log(data);
        console.log(data.responseText);
      })
      .always(function() {
        console.log("PLEX QUERY RUN");
      });
    }

    //no internet connection
    else {
      this.props.updateUserCount(0);
      plexQueryTimeout = setTimeout(() => {
        this.plexQuery(ip, token);
      }, this.props.serverInterval);
      console.log("AFTER TIMEOUT")
    }
  },
  logOut: function(timeOut) {
    hashHistory.push('/')
    console.log('logout');
    let settings = {}
    settings.loggedIn = false;
    settings.isActive = false;
    settings.userCount = 0;
    this.props.updateLoggedInState(false);
    ipcRenderer.send('asynchronous-message', settings);
  },
  render: function() {
    console.log('render media info wrap')

    let logOutButton = <button className="plex-button" onClick={this.logOut}>Logout</button>
    if (this.state.mediaInfo.length < 1) {
      return(
        <div className='mediaInfoWrapper'>
          <NoActiveUsers/>
          {logOutButton}
        </div>
      )
    } else {
      return(
        <div className='mediaInfoWrapper'>
          {this.state.mediaInfo.map((data, key) =>
            <MediaItem key={key} index={key} details={data} />)}
          {logOutButton}
        </div>
      )
    }
  }
});
