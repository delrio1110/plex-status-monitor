import React from 'react'
import LoginForm from './LoginForm'

export default React.createClass({
  render : function() {
    return (
      <div className='login'>
        <LoginForm addPlexData={this.props.addPlexData} updateUserState={this.props.updateUserState} updateUserIP={this.props.updateUserIP} serverInterval={this.props.serverInterval} loggedIn={this.props.loggedIn} updateUserCount={this.props.updateUserCount}/>
      </div>
    )
  }
});
