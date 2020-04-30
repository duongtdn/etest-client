"use strict"

import React, { Component } from 'react'

export default class extends Component {
  constructor(props) {
    super(props);
    this.retry = this.retry.bind(this);
  }
  render() {
    return (
      <div className="w3-modal-content">
        <div className="w3-container w3-padding">
          <h4 className="w3-text-red"> Submit result failed </h4>
          <p> The problem may be because of unreliable network connection or busy server! <br />Please wait for few seconds and click below button to retry </p>
          <p>
            <button className="w3-button w3-blue" onClick = {this.retry}> Retry </button>
            <button className="w3-button" onClick = {this.props.self.reject}> Cancel </button>
          </p>
        </div>
      </div>
    )
  }
  retry() {
    this.props.self.resolve();
    this.props.self.retry && this.props.self.retry();
  }
}
