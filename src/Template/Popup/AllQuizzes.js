"use strict"

import React, { Component } from 'react'

import storage from '../../lib/storage'
import CircleTag from '../Widgets/CircleTag'

export default class extends Component {
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
    const content = this.props.self.test.content
    return (
      <div className="w3-modal-content">
        <div className="w3-container w3-padding">
          <span onClick={e => this.props.self.resolve()} className="w3-button w3-display-topright w3-red">&times;</span>
          <h4> Submitted {this.state.submitted.length}/{Object.keys(content.questions).length} </h4>
          {
            content.sections.map(section => {
              return (
                <div key={section.id}>
                  <p className="w3-text-blue-grey w3-small w3-border-bottom"> {section.title} </p>
                  {
                    content.questions.map( (question, index) => {
                      if (question.section === section.id) {
                        let color = 'pale-red'
                        if (this.state.submitted.indexOf(index) !== -1) {
                          color = 'green'
                        }
                        return (
                          <CircleTag key={index} value={index+1} color={color} onClick={e => this.selectQuiz(index)}/>
                        )
                      }
                    })
                  }
                </div>
              )
            })
          }
          <footer style={{margin: '16px 0'}} />
        </div>
      </div>
    )
  }
  selectQuiz(index) {
    this.props.self.resolve(index);
  }
}
