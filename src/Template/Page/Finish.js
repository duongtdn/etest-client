"use strict"

import React, { Component } from 'react'

import Header from '../Widgets/Header'

export default class Finish extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div>
        <Header {...this.props} />
        <div className="w3-container" style={{maxWidth: '1200px', margin: 'auto', padding: '64px 0', textAlign: 'center'}}>
          <h3 className="w3-text-blue"> Test has been completed. Thank you for your participation</h3>
          <p> To access test result, click here </p>
          <p>
            <a href={`/result?id=${this.props.test.resultId}`} className="w3-button w3-blue"> Test Result </a>
          </p>
        </div>
      </div>
    )
  }
}
