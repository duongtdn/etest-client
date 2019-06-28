"use strict"

import React, { Component } from 'react'

export default class UserNotSignedIn extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="w3-container">
        <div style={{margin: 'auto', textAlign: 'center', paddingTop: '30px'}}>
          <h3 className='w3-text-red'> Forbidden </h3>
          <p className='w3-text-grey'> You need to sign in for using this page </p>
        </div>
      </div>
    )
  }
}
