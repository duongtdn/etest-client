"use strict"

import React, { Component } from 'react'

export default class Title extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-cell-row" style={{marginTop: '10px'}}>
        <div className="w3-text-blue w3-cell" style={{fontWeight:'bold'}}>
          {this.props.title}
        </div>
        <div className="w3-text-grey w3-small w3-cell" style={{textAlign: 'right'}}> {this.props.today}</div>
      </div>
    )
  }
}
