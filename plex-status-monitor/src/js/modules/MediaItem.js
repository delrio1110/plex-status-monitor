import React from 'react'
import MediaTrackTitle from './MediaTrackTitle'
import MediaMovieTitle from './MediaMovieTitle'

export default React.createClass({

  getInitialState: function() {
    return {
      imageClassNames: 'media-image animated'
    }
  },
  animateImageOnLoad: function() {
    this.setState({imageClassNames: 'media-image loaded animated flipInY'})
  },

  render: function() {
    
    let userThumbImg
    if (this.props.details.userId == '1') {
      userThumbImg = <img className="user-image" src={this.props.details.userThumb} alt="" /> 
    } else {
      userThumbImg = <img className="user-image" src={this.props.details.userFriendAvatar} alt="" />
    }
    let mediaDurationBarPercent = {width: this.props.details.mediaTimeLeft}
    let imageClassNames = 'media-image animate'

    return (
      <div className="media-wrapper clearfix">

        <div className="media-content-wrap">
          <div className="media-information">
            <p>Completion Time: {this.props.details.mediaCompletion}</p>
            <p>Player State: {this.props.details.playerState}</p>
          </div>
          
          <img src={this.props.details.mediaImg} className={this.state.imageClassNames} alt="" onLoad={this.animateImageOnLoad} />
          <div className="media-duration-bar"></div>
          <div className="media-duration-bar-highlight" data-timeline={this.props.details.mediaTimeLeft} style={mediaDurationBarPercent} data-media-index={this.props.details.movieIndex}></div>
        </div>

        {this.props.details.mediaTypeIsTrack ? <MediaTrackTitle details = {this.props.details} /> : <MediaMovieTitle details = {this.props.details} /> }

        <div className="user-info-wrap">
          <p className="user-name">{this.props.details.userName}</p>
          {userThumbImg || ''}
        </div>
      </div>
    )
  }
});
