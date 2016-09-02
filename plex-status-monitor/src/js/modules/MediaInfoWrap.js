import React from 'react'
import MediaInfoWrapTrackContent from './mediaInfoWrapTrackContent'
import MediaInfoWrapMovieContent from './mediaInfoWrapMovieContent'

export default React.createClass({

  render: function() {
    console.log('MEDIA INFO WRAP CONTAINER PROPS', JSON.stringify(this.props));

    let userThumbImg = <img className="user-image" src={this.props.details.userThumb} alt="" />
    let mediaDurationBarPercent = {width: this.props.details.mediaTimeLeft}
    
    return (
      <div className="media-wrapper clearfix">

        <div className="media-content-wrap">
          <img src={this.props.details.mediaImg} className="media-image" alt="" />
          <div className="media-duration-bar"></div>
          <div className="media-duration-bar-highlight" data-timeline={this.props.details.mediaTimeLeft} style={mediaDurationBarPercent} data-media-index={this.props.details.movieIndex}></div>
        </div>

        {console.log('MEDIA INFO WRAO PROPSSS?!' ,this.props)}

        {this.props.details.mediaTypeIsTrack ? <MediaInfoWrapTrackContent details = {this.props.details} /> : <MediaInfoWrapMovieContent details = {this.props.details} /> }

        <div className="user-info-wrap">
          <p className="user-name">{this.props.details.userName}</p>
          {userThumbImg || ''}
        </div>
      </div>
    )
  }
});
