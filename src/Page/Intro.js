"use strict"

import React, { Component } from 'react'

export default class Intro extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-container">
        <div style={{margin: 'auto', width: '280px', textAlign: 'center', paddingTop: '30px'}}>
          <span className='w3-large w3-text-blue'> Welcome to Test Center </span>
          <br />
          <span className='w3-text-blue-grey'> Explaination about this test here (TBI) </span>
        </div>
        <div className='' style={{margin: 'auto', marginTop:'30px', width: '280px', textAlign: 'center', padding: '20px'}}>
          <button className="w3-button w3-blue" onClick={this.props.enterTest}> Click here to Enter Test </button>
        </div>
      </div>
    )
  }
}
