"use strict"

import React, { Component } from 'react'

export default class CircleTag extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const i = this.props.value
    const color = this.props.color || 'blue'
    return (
      <div  className={`w3-${color} w3-hover-yellow`} key={i}
            style={{height: '30px', width: '30px', borderRadius: '50%', textAlign: 'center', display: 'inline-block', margin: '8px 4px 0 0', cursor: 'pointer', padding: '2px 0px'}}
            onClick = {this.props.onClick}>
        <span className="w3-small"> {i+1} </span>
      </div>
    )
  }
}
