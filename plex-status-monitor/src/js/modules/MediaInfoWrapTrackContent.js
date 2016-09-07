import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div className="media-info-wrap">
        <h3 className="media-artist">{this.props.details.mediaAlbulmArtist}</h3>
        {/*<h4 className="media-albulm">{this.props.details.mediaAlbulmTitle}</h4>*/}
        <p className="media-title">{this.props.details.mediaTitle}</p>
        {/*<p>Completion Time:<br />{this.props.details.mediaCompletion}</p>
        <p>{this.props.details.playerTitle}</p>
        <p>{this.props.details.playerState}</p>*/}
      </div>
    )
  }
});
