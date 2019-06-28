"use strict"

import React, { Component } from 'react'

import storage from '../lib/storage'

export default class EndPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: storage.get(storage.SUBMITTEDKEY) || [],
    }
  }
  componentDidMount() {
    this._sHandler = storage.observe(storage.SUBMITTEDKEY, (data) => {
      const submitted = data || []
      this.setState({ submitted })
    })
  }
  componentWillUnmount() {
    storage.observe(storage.SUBMITTEDKEY, this._sHandler, false)
  }
  render() {
    const quizzesLeft = this.props.totalQuizzes - this.state.submitted.length
    if (this.props.timeout) {
      return this.renderIfTimeout(quizzesLeft)
    } else {
      return this.renderIfNotTimeout(quizzesLeft)
    }
  }
  renderIfTimeout() {
    return(
      <div className="w3-modal" style={{ display: this.props.show ? 'block' : 'none' }}>
         <div className="w3-modal-content">
          <div className="w3-container w3-padding">
            <span onClick={this.props.close} className="w3-button w3-display-topright">&times;</span>
            <h4 className="w3-text-blue" style={{marginTop: '32px'}}> This test is ending </h4>

            <p className="w3-text-dark-grey"> Submitting all left answers and finish. Please do not close the broswer </p>

          </div>
        </div>
      </div>
    )
  }
  renderIfNotTimeout(quizzesLeft) {
    return(
      <div className="w3-modal" style={{ display: this.props.show ? 'block' : 'none' }}>
         <div className="w3-modal-content">
          <div className="w3-container w3-padding">
            <span onClick={this.props.close} className="w3-button w3-display-topright">&times;</span>
            <h4 className="w3-text-blue" style={{marginTop: '32px'}}> Dou you really want to finish your test? </h4>

            {
              quizzesLeft === 1 ?
                <p className="w3-text-dark-grey"> 1 question is not answerred or submitted </p>
                :  quizzesLeft > 1 ? <p className="w3-text-dark-grey"> {quizzesLeft} questions are not answerred or submitted </p>
                : null
            }

            <hr />

            <div className = "w3-right">
              <button className="w3-button" onClick = {this.props.close}> Cancel </button>
              <button className="w3-button w3-blue" onClick = {this.props.finish}> Finish </button>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
