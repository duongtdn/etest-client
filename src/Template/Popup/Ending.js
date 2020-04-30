"use strict"

import React, { Component } from 'react'

import storage from '../../lib/storage'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: storage.get(storage.SUBMITTEDKEY) || [],
    }
    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  componentDidMount() {
    this._sHandler = storage.observe(storage.SUBMITTEDKEY, (data) => {
      const submitted = data || [];
      this.setState({ submitted });
    });
  }
  componentWillUnmount() {
    storage.observe(storage.SUBMITTEDKEY, this._sHandler, false);
  }
  render() {
    const quizzesLeft = this.props.self.test.content.questions.length - this.state.submitted.length;
    if (this.props.self.timeout) {
      return this.renderIfTimeout(quizzesLeft);
    } else {
      return this.renderIfNotTimeout(quizzesLeft);
    }
  }
  renderIfTimeout() {
    return(
      <div className="w3-modal-content">
        <div className="w3-container w3-padding">

          <h4 className="w3-text-blue" style={{marginTop: '32px'}}> Time up! This test is ended </h4>

          <p className="w3-text-dark-grey"> Submitting your answers. <span className="w3-text-red">Please do not close the broswer </span></p>

          <div style={{height: '30px'}} />

        </div>
      </div>
    )
  }
  renderIfNotTimeout(quizzesLeft) {
    return(
      <div className="w3-modal-content">
        <div className="w3-container w3-padding">
          <span onClick={this.cancel} className="w3-button w3-display-topright">&times;</span>
          <h4 className="w3-text-blue" style={{marginTop: '32px'}}> Do you really want to finish your test? </h4>

          {
            quizzesLeft === 1 ?
              <p className="w3-text-dark-grey"> 1 question is not answerred or submitted </p>
              :  quizzesLeft > 1 ? <p className="w3-text-dark-grey"> {quizzesLeft} questions are not answered or submitted </p>
              : null
          }

          <hr />

          <div className = "w3-right">
            <button className="w3-button" onClick = {this.cancel}> Cancel </button>
            <button className="w3-button w3-blue" onClick = {this.confirm}> Finish </button>
          </div>

        </div>
      </div>
    )
  }
  cancel() {
    this.props.self.reject();
  }
  confirm() {
    this.props.self.resolve();
  }
}
