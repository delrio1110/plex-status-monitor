import React from 'react'
import LoginForm from './LoginForm'
import Header from './Header'

export default React.createClass({
  render : function() {
    return (
      <div className='login'>
        <Header/>
        <LoginForm addPlexData={this.addPlexData} updateUserState={this.updateUserState}/>
      </div>
    )
  }
});
