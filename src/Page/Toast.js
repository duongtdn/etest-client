"use strict"

import React, { Component } from 'react'

export default class Toast extends Component {
  constructor(props) {
    super(props)
    this._timer = null
    this._close = this._close.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this._startTimeout(3000)
    }
  }
  componentWillUnmount() {
    this._stopTimeout()
  }
  render() {
    const style = {
      position: 'fixed',
      width: '100%',
      display: 'none'
    }
    if (this.props.show) {
      style.display = 'block'
    }
    if (this.props.top) {
      style.top = 0
    } else {
      style.bottom = 0
    }
    return (
      <div className={`w3-red w3-padding ${this.props.top? 'w3-animate-top' : 'w3-animate-bottom'}`} style={style}>
        <span onClick={this._close} className="w3-button w3-display-topright"> X </span>
        <p className="w3-container"> {this.props.toast} </p>
      </div>
    )
  }
  _close() {
    this._stopTimeout()
    this.props.close && this.props.close()
  }
  _startTimeout(duration) {
    this._timer = setTimeout(() => {
      this.props.close && this.props.close()
    }, duration)
  }
  _stopTimeout() {
    clearTimeout(this._timer)
  }
}
