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
    this.setState({loggedIn: true})
  },

  updateUserIP: function(ip) {
    console.log('ADD PLEX DATA')
    this.setState({userIP: ip})
  },

  updateUserCount: function(useCount) {
    // this.setState({userCount: useCount})
    alert('run')
    //update App Icon
    // this.updateAppIcon(useCount)
  },

  updateAppIcon: function(userCount) {

    var appSettings
    // userCount > 0 ? appSettings.isActive = true : appSettings.isActive = false
    appSettings.userCount = userCount
    appSettings.isActive = true
    
    var ipcRenderer = window.ipcRenderer;
    alert(appSettings)
    ipcRenderer.send('asynchronous-message', appSettings);
  },

  render: function() {
    let login
    if (!this.state.loggedIn) {
      login = <LoginForm addPlexData={this.addPlexData} updateUserState={this.updateUserState} updateUserIP={this.updateUserIP} serverInterval={this.state.serverInterval}/>
    }
    console.log('PLEX DATA IS IN THE STATE!!', this.state.plexData)
    return (
      <div className='app'>
        <Header/>
        {login}
        {console.log('PLEX DATA IS IN THE STATE!!', this.state.plexData)} 
        <MediaContainer plexData={this.state.plexData} userToken={this.state.plexToken} userIP={this.state.userIP} updateUserCount={this.updateUserCount}/>
      </div>
    )
  }
})
