import React from 'react'
import MediaItem from './MediaItem'
import { msToTime } from '../helperFunctions'
import { hashHistory } from 'react-router'
import NoActiveUsers from './NoActiveUsers'
import isOnline from 'is-online'
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

    if (Object.keys(data).length === 0) return

    else {
      console.log('SETTING PLEX DATA!', data._children);
      console.log(data);
      console.log(data._children);

      var mediaInfoDataList = []


      // if (!Array.isArray(data.MediaContainer.Track)) {
      //   //IF NOT ARRAY MAKE IT AN ARRAY!
      //   data.MediaContainer.Track = [data.MediaContainer.Track];
      // }

      // for (var i=0; i<data._children.length; i++) {
      //
      // }

      //MOVIE / TV SHOW DATA
      // if (!Array.isArray(data.MediaContainer.Video)) {
      //   //IF NOT ARRAY MAKE IT AN ARRAY!
      //   data.MediaContainer.Video = [data.MediaContainer.Video];
      // }
      for ( var i = 0; i < data._children.length; i++ ) {
        var mediaInfoData = {}

        var mediaDurationinMs = data._children[i].duration
        var mediaOffsetinMs = data._children[i].viewOffset
        var mediaDuration = msToTime(mediaDurationinMs)
        var mediaOffset = msToTime(mediaOffsetinMs)

        var mediaPercentWatched = ((data._children[i].viewOffset) / (data._children[i].duration) * 100)
        var date = new Date()
        var mediaCompletionEstimate = new Date(date.setMilliseconds(date.getMilliseconds() + (mediaDurationinMs - mediaOffsetinMs))).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})



        console.log("MOVIE DURATION: ", mediaDuration)
        console.log("MOVIE WATCHED: ", mediaOffset)
        console.log(data._children[i]._children)
        // if (Array.isArray(data._children[i]._children)) {
          console.log(data._children[i]._children)
          for (var j=0; j<data._children[i]._children.length; j++) {

            if (data._children[i]._children[j]._elementType == 'User') {
                mediaInfoData.mediaType = data._children[i]._elementType
                mediaInfoData.userThumb = data._children[i]._children[j].thumb;
                mediaInfoData.userName = data._children[i]._children[j].title;
                mediaInfoData.mediaTitle = data._children[i].title;
                mediaInfoData.mediaAlbulmTitle = data._children[i].parentTitle;
                mediaInfoData.mediaAlbulmArtist = data._children[i].grandparentTitle;
                mediaInfoData.mediaImg = ip + data._children[i].art + '?X-Plex-Token=' + token;
                mediaInfoData.mediaMovieYear = data._children[i].year;
                mediaInfoData.mediaDuration = mediaDuration;
                mediaInfoData.mediaOffset = mediaOffset;
                mediaInfoData.mediaCompletion = mediaCompletionEstimate;
                mediaInfoData.mediaTimeLeft = mediaPercentWatched + '%';

                //Check if mediaType is a Track
                (data._children[i]._elementType == 'Track') ? mediaInfoData.mediaTypeIsTrack = true : mediaInfoData.mediaTypeIsTrack = false
            }

            if (data._children[i]._children[j]._elementType == 'Player') {
              mediaInfoData.playerTitle = data._children[i]._children[j].title;
              mediaInfoData.playerState = data._children[i]._children[j].state;
            }

            // debugger;

            if (j == data._children[i]._children.length-1) {
              mediaInfoDataList.push(mediaInfoData)
              // this.addMediaInfo(mediaInfoData)
            }
          } //end inner loop
          // this.addMediaInfo(mediaInfoData)
          // data._children[i]._children = {data._children[i]._children}
        // }
        // mediaInfo.push(mediaInfoData);
      }// end outer loop
      this.addMediaInfo(mediaInfoDataList)

    }
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
        console.log("PING SERVER EVERY 30 seconds")
         console.log("SERVER INTERVAL:", this.props.serverInterval);

          this.timeout = setTimeout(() => {
            this.plexQuery(ip, token);
          }, this.props.serverInterval);
          console.log("AFTER TIMEOUT")

        // $('#test-image').attr('src', url + jsonData.MediaContainer.Video['@attributes'].art + '?X-Plex-Token=' + token);
      })
      .fail(function(data) {
        console.log("PLEX QUERY ERROR!");
        console.log("Is your server online?");
        console.log(data);
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
