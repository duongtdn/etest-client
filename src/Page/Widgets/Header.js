"use strict"

import React, { Component } from 'react'

class UserSnipet extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const user = this.props.user
    const avata = this._getUserAvata()
    return (
      <div className="w3-bar-item w3-dropdown-hover w3-white w3-hover-pale-green" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <span >
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </span>
        <div className={` w3-dropdown-content w3-bar-block w3-border`} style={{margin: '3px 0px 3px -16px', minWidth: '131px'}}>
          <button className="w3-bar-item w3-button" onClick={evt => this.props.accountClient.signout()}> Logout </button>
        </div>
      </div>
    )
  }
  _getUserAvata() {
    const user = this.props.user
    if (user.profile.picture) { return user.profile.picture }
    if (user.profile.gender === 'female') {
      return this.props.template.avata.female
    } else {
      return this.props.template.avata.male
    }
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <header className="">
        <div className="w3-bar" style={{maxWidth: '1200px', margin: 'auto'}}>
            <div className="w3-bar-item">
              Test Room
            </div>
            <div className={`w3-right w3-container `}>
              {
                this.props.user?
                  <UserSnipet user={this.props.user}
                              accountClient={this.props.accountClient}
                              endgame={this.props.endgame}
                              template = {this.props.template}
                  />
                : null
              }
            </div>
        </div>
      </header>
    )
  }
}
