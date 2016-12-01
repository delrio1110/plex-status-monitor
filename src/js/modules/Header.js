import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  // getInitialState: function() {
  //   return {
  //     loggedIn: false
  //   }
  // },
  // componentWillReceiveProps: function(props) {
  //   this.setState({loggedIn: props.loggedIn})
  //   console.log('HEADER PROPS', props)
  // },
  render: function() {
    console.log(this.props)
    let currentLocation = this.props.location.pathname
    console.log('PATH', currentLocation)
    let settingsLinkPath
    let settingsClassName = 'settingsLink'
    if (this.props.loggedIn && currentLocation == '/settings') {
      settingsLinkPath = '/app'
      settingsClassName = 'settingsLink active'
    } else if (currentLocation == '/settings') {
      settingsLinkPath = '/'
      settingsClassName = 'settingsLink active'
    } else {
      settingsLinkPath = '/settings'
    }
    let settingsLink = <Link to={settingsLinkPath} className={settingsClassName} activeClassName='active'><i className="icomoon-cog icon-cog"></i></Link>
    return (
      <header>
        <img src="images/plex-white.png" alt="plex logo" />
        <h1>Status Monitor</h1>
        {settingsLink}
      </header>
    )
  }
});
