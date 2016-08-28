import React from 'react'
import MediaInfoWrapTrackContent from './mediaInfoWrapTrackContent'
import MediaInfoWrapMovieContent from './mediaInfoWrapMovieContent'

export default React.createClass({
  render: function() {
    let userThumb = this.props.details.userThumb;
    if(userThumb) {
      let userThumbImg = <img className="user-image" src="{this.props.plexData.userThumb}" alt="" />
    }
    return (
      <div className="media-wrapper clearfix">

        <div className="media-content-wrap">
          <img src="{this.props.plexData.mediaImg}" className="media-image" alt="" />
          <div className="media-duration-bar"></div>
          <div className="media-duration-bar-highlight" data-timeline="{this.props.plexData.mediaTimeLeft}" style={{width: '{this.props.plexData.mediaTimeLeft}'}} data-media-index="{this.props.plexData.movieIndex}"></div>
        </div>

        {this.props.plexData.mediaTypeIsTrack ? <MediaInfoWrapTrackContent details = {this.props.details} /> : <MediaInfoWrapMovieContent details = {this.props.details} /> }

        <div className="user-info-wrap">
          <p className="user-name">{this.props.details.userName}</p>
          {userThumbImg}
        </div>
      </div>
    )
  }
});
