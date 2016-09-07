import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div className="media-info-wrap">
        <h3 className="media-title">{this.props.details.mediaTitle}</h3>
        <p className="media-year">{this.props.details.mediaYear}</p>
    {/* <p>Completion Time:<br />{this.props.details.mediaCompletion}</p>
        <p>{this.props.details.playerTitle}</p>
        <p>{this.props.details.playerState}</p> */}
      </div>
    )
  }
});
