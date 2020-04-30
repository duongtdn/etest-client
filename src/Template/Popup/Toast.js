"use strict"

import React, { Component } from 'react'

export default class extends Component {
  render() {
    return (
      <div className = {`w3-container w3-${this.getBgColor()}`}>
        <p className="w3-small"> {this.props.self.message}
          {
            this.props.self.closeBtn ?
              <span className="cursor-pointer w3-right" onClick={e => this.props.self.close()}> &times; </span>
              : null
          }
        </p>
      </div>
    )
  }
  getBgColor() {
    if (!this.props.self.type) {
      return 'black';
    }
    switch (this.props.self.type) {
      case 'error':
        return 'red';
      case 'info':
        return 'blue';
      case 'success':
        return 'green';
      case 'system':
      default:
        return 'black';
    }
  }
}