import React from 'react'
import LoginForm from './LoginForm'
import Header from './Header'
import MediaContainer from './MediaContainer'


export default React.createClass({
  getInitialState: function() {
    return {
      username: {},
      password: {},
      plexToken: {},
      plexData: {},
      loggedIn: false
    }
  },
  addPlexData: function(plexData) {
    console.log('ADD PLEX DATA')
    this.state.plexData = plexData
    this.setState({plexData: this.state.plexData})
    console.log(this.state.plexData)
  },
  updateUserState: function(userObject) {
    this.state.username = userObject.username
    this.setState({username: this.state.username})
    this.state.password = userObject.password
    this.setState({password: this.state.password})
    this.state.plexToken = userObject.plexToken
    this.setState({plexToken: this.state.plexToken})
    this.state.loggedIn = true;
    this.setState({loggedIn: this.state.loggedIn})
  },
  render: function() {
    let login
    if (!this.state.loggedIn) {
      login = <LoginForm addPlexData={this.addPlexData} updateUserState={this.updateUserState}/>
    }
    return (
      <div className='app'>
        <Header/>
        {login}
        <MediaContainer plexData = {this.state.plexData}/>
      </div>
    )
  }
});
