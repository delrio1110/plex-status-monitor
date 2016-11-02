import React from 'react'
import LoginForm from './LoginForm'
import Header from './Header'
import MediaContainer from './MediaContainer'


// export default class Application extends React.Component {
export default React.createClass({

  getInitialState: function() {
    return {
      username: '',
      password: '',
      plexToken: '',
      plexData: {},
      userIP: '',
      loggedIn: false,
      userCount: 0,
      serverInterval: 30000
    }
  },

  addPlexData: function(plexData) {
    console.log('ADD PLEX DATA')
    this.setState({plexData: plexData})
  },

  updateUserState: function(userObject) {
    this.setState({username: userObject.username})
    this.setState({password: userObject.password})
    this.setState({plexToken: userObject.token})
    // this.setState({loggedIn: true})
  },

  updateLoggedInState: function(boolean) {
    this.setState({loggedIn: boolean })
  },

  updateUserIP: function(ip) {
    console.log('ADD PLEX DATA')
    this.setState({userIP: ip})
  },
  updateUserCount: function(userCount) {
    // this.setState({userCount: userCount})
    console.log('=====UPDATE USER COUNT=======')
    this.updateAppIcon(userCount)
  },
  updateAppIcon: function(userCount) {
    console.log('===updateAppIcon===')
    let appSettings = {}
    appSettings.isActive = false
    appSettings.userCount = userCount
    userCount > 0 ? appSettings.isActive = true : appSettings.isActive = false

    var ipcRenderer = window.ipcRenderer;
    console.log(appSettings)
    ipcRenderer.send('asynchronous-message', appSettings);
  },
  render: function() {

    var children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        addPlexData: this.addPlexData,
        updateUserState: this.updateUserState,
        updateLoggedInState: this.updateLoggedInState,
        updateUserIP: this.updateUserIP,
        serverInterval: this.state.serverInterval,
        loggedIn: this.state.loggedIn,
        plexData: this.state.plexData,
        plexToken: this.state.plexToken,
        userIP: this.state.userIP,
        updateUserCount: this.updateUserCount,
        // location: this.props.location
      })
    })

    console.log('PLEX DATA IS IN THE STATE!!', this.state.plexData)
    return (
      <div className='app'>
        <Header loggedIn={this.state.loggedIn} location={this.props.location}/>
        {children}
      </div>
    )
  }
})
