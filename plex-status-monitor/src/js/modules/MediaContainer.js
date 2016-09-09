import React from 'react'
import MediaItem from './MediaItem'
import { msToTime } from '../helperFunctions'
import NoActiveUsers from './NoActiveUsers'

export default React.createClass({
  getInitialState: function() {
    return {
      mediaInfo: []
    }
  },
  // shouldComponentUpdate: function() {
  //   if (!this.props.plexData) {
  //     console.log(this.props.plexData.length)
  //     return false;
  //   } else {
  //     return true;
  //   }
  // },
  componentWillMount: function () {
    console.log('COMPONENT WILL MOUNT',this.props)
    this.setPlexData(this.props.plexData, this.props.userIP, this.props.plexToken)
  },
  componentWillReceiveProps: function(props) {
    console.log('COMPONENT WILL RECEIVE PROPS:', props)
    this.setPlexData(props.plexData, props.userIP, props.userToken)
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
          new Notification(newMediaData[i].mediaTitle, {
            body: newMediaData[i].userName + ' started playing ' + newMediaData[i].mediaTitle + ' on ' + newMediaData[i].playerTitle,
            icon: '../../../images/app-icon.png'
          });
        }
      } else {
        new Notification(newMediaData[i].mediaTitle, {
          body: newMediaData[i].userName + ' started playing ' + newMediaData[i].mediaTitle + ' on ' + newMediaData[i].playerTitle,
          icon: '../../../images/app-icon.png'
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
  render: function() {
    console.log('render media info wrap')
    if (this.state.mediaInfo.length < 1) {
      return(
        <NoActiveUsers/>
      )
    } else {
      return(
        <div className='mediaInfoWrapper'>
          {this.state.mediaInfo.map((data, key) =>
            <MediaItem key={key} index={key} details={data} />)}
        </div>
      )
    }
  }
});
