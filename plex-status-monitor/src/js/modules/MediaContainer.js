import React from 'react'
import MediaInfoWrap from './MediaInfoWrap'
import { msToTime } from '../helperFunctions'

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
  componentWillReceiveProps: function() {
    this.setPlexData(this.props.plexData, this.props.userIP, this.props.plexToken)
    console.log('SET PLEX DATA WILL MOUNT')
  },
  addMediaInfo: function(mediaInfoData) {
    this.state.mediaInfo.push(mediaInfoData)
    this.setState({mediaInfo: this.state.mediaInfo})
  },
  setPlexData: function(data, ip, token) {
    console.log('SETTING PLEX DATA!', data._children);
    if(!data._children) return
    // console.log(data.MediaContainer['@attributes'].size);
    if (data._children.length < 1) {
      $('#user-section').html('<i className="icomoon-hipster icon-hipster"></i><h3>No Active Users</h3>')
      $logOutButton.show();
      settings.isActive = false;
      settings.userCount = '0';
      ipcRenderer.send('asynchronous-message', settings);

      return;
    }

    else {
      console.log(data);
      console.log(data._children);


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
      for (var i=0; i<data._children.length; i++) {
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
                mediaInfoData.mediaYear = data._children[i].year;
                mediaInfoData.mediaDuration = mediaDuration;
                mediaInfoData.mediaOffset = mediaOffset;
                mediaInfoData.mediaCompletion = mediaCompletionEstimate;
                mediaInfoData.mediaTimeLeft = mediaPercentWatched + '%';

                if(data._children[i]._elementType == 'Track') {
                  mediaInfoData.mediaTypeIsTrack = true;
                }
            }

            if (data._children[i]._children[j]._elementType == 'Player') {
              mediaInfoData.playerTitle = data._children[i]._children[j].title;
              mediaInfoData.playerState = data._children[i]._children[j].state;
            }

            if (j == data._children[i]._children.length-1) {
              this.addMediaInfo(mediaInfoData)
            }
          } //end inner loop
          // data._children[i]._children = {data._children[i]._children}
        // }
        // mediaInfo.push(mediaInfoData);
      }// end outer loop
    }
  },
  renderMediaInfoWrap: function(key) {
    console.log('RENDER MEDIA DISPLAY')
    // this.setPlexData(this.props.plexData)
    return <MediaInfofWrap key={key} index={key} details={this.state.mediaInfo[key]} />
  },
  render: function() {
    console.log('render media info wrap')
    return(
      <div className='mediaInfoWrapper'>
        {console.log('MediaInfoObject',this.state.mediaInfo)}
        {this.state.mediaInfo.map(this.renderMediaInfoWrap)}
      </div>
    )
  }
});
