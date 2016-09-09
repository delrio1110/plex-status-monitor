import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div className="media-info-wrap">
        <h3 className="media-artist">{this.props.details.mediaAlbulmArtist}</h3>
        <p className="media-title">{this.props.details.mediaTitle}</p>
      </div>
    )
  }
});
