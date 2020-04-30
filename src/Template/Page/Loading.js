"use strict"

import React, { Component } from 'react'

export default class Loading extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-container">
        <div style={{margin: 'auto', width: '280px', textAlign: 'center', paddingTop: '30px'}}>
          <span className='w3-large w3-text-blue'> Welcome to Test Center </span>
          <br />
          <span className='w3-text-blue-grey'> Please wait while we are downloading test content </span>
        </div>
        <div className='w3-border w3-round w3-border-grey' style={{margin: 'auto', marginTop:'30px', width: '280px', textAlign: 'center', padding: '20px'}}>
          <div className='w3-large w3-text-dark-grey' style={{fontWeight: 'bold', marginBottom: '6px'}}> LOADING </div>
          <div className='w3-text-grey'> {this.props.loadContext} </div>
          <div>
            <span className='w3-large w3-text-blue' style={{fontWeight: 'bold'}}> . . . </span>
          </div>
        </div>
      </div>
    )
  }
}
