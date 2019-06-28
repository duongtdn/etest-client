"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

export default class Error extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-container">
        <div style={{margin: 'auto', textAlign: 'center', paddingTop: '30px'}}>
          <h3 className='w3-text-red'> {this.props.error.title} </h3>
          <p className='w3-text-grey'> {this.props.error.message} </p>
        </div>
      </div>
    )
  }
}
