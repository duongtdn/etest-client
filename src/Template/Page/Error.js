"use strict"

import React, { Component } from 'react'

export default class Error extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-container">
        <div style={{margin: 'auto', textAlign: 'center', paddingTop: '30px'}}>
          <h3 className='w3-text-red'> {this.props.code || this.props.page.data.code} </h3>
          <p className='w3-text-grey'> {this.props.message || this.props.page.data.message} </p>
        </div>
      </div>
    )
  }
}
