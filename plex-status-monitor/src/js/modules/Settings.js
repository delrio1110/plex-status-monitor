import React from 'react'
import { Link } from 'react-router'
import CSSTransitionGroup from 'react-addons-css-transition-group'

export default class Settings extends React.Component {
  render() {
    return (
        <form id="settings">
          <h2>Settings</h2>
          <div className="input-wrap">
            <div className="input-field">
              <label htmlFor="">Server Refresh Rate</label>
              <input type="number" id="serverping" ref="username" placeholder="30" />
            </div>
            <div className="input-field">
              <label htmlFor="">Show Dock Icon</label>
              <input type="checkbox" id="showDockIcon" ref="showDockIcon" className="settingsCheckbox" />
            </div>
            <div className="input-field">
              <label htmlFor="">Remember Login</label>
              <input type="checkbox" id="showDockIcon" ref="showDockIcon" className="settingsCheckbox" />
            </div>
          </div>
          <CSSTransitionGroup className="plex-button" type="submit" id="login-button" onClick={this.startSignInLoader}
          component="button"
          transitionName="loader"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
            <span>Save Settings</span>
          </CSSTransitionGroup>
        </form>
    )
  }
};
