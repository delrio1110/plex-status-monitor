import React from 'react'
import { Link } from 'react-router'
import CSSTransitionGroup from 'react-addons-css-transition-group'

export default class Settings extends React.Component {
  render() {
    return (
        <form>
          <h2>Settings</h2>
          <div className="input-wrap">
          </div>
          <CSSTransitionGroup className="plex-button" type="submit" id="login-button" onClick={this.startSignInLoader}
          component="button"
          transitionName="loader"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          </CSSTransitionGroup>
        </form>
    )
  }
};
