"use strict"

import React, { Component } from 'react'

import { formatDate } from '../../lib/date'

export default class extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.action.loadResult(this.props.id)
  }
  render() {
    if (this.props.test === null) { return null }
    const test = this.props.test;
    if (test.result) {
      const user = this.props.user
      const tag = `w3-tag ${test.result.status==='passed'?'w3-green':'w3-red'}`
      return (
        <div>
          <div style={{height: '30px'}} />
          <div className="w3-container" style = {{maxWidth: '1120px', margin: 'auto'}}>

            <h4 style={{fontWeight: 'bold'}}>
              <img className="w3-circle"style={{width: '40px'}} src={user.profile.picture || this.props.env.template.avata.male} />
              {' '} {user.profile.fullName}
            </h4>

            <div style={{margin: '24px 0'}}>
              <p className="w3-text-blue-grey w3-small w3-border-bottom"> Result Overview </p>
              <p>
                <span className="w3-text-blue w3-large"> {test.title} </span> <br />
                <span className="w3-text-grey" style={{fontStyle: 'italic'}}> {test.description} </span>
              </p>
              <table className="w3-table">
                <tbody>
                  <tr>
                    <td className="w3-text-grey"> Taken at </td>
                    <td> {formatDate(new Date(test.startAt))} </td>
                  </tr>
                  <tr>
                    <td className="w3-text-grey"> Result </td>
                    <td> <span className={tag}> {test.result.status.toUpperCase()} </span> </td>
                  </tr>
                  <tr>
                    <td className="w3-text-grey"> Total Score </td>
                    <td> <span > {test.result.score.total} </span> {' '} pt. </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{margin: '24px 0'}}>
              <p className="w3-text-blue-grey w3-small w3-border-bottom"> Result Detail </p>
              <table className="w3-table">
                <tbody className="">{
                  test.content.sections.map(section => {
                    const result = test.result.score.sections.filter(s => s.id === section.id)[0]
                    return (
                      <tr className="w3-border-bottom" key={section.id}>
                        <td>
                          <span> {section.title} </span> <br/>
                          <span className="w3-text-grey w3-small"> {section.description} </span>
                        </td>
                        <td>
                          <span className="w3-text-blue-grey" style={{fontWeight: 'bold'}}>
                            {result.score}
                          </span>
                          /
                          <span className="w3-text-grey w3-small" style={{fontWeight: 'bold'}}>
                            {result.points}
                          </span>
                          <span className="w3-text-grey" >
                            {' '} pt.
                          </span>
                        </td>
                      </tr>
                    )
                  })
                }</tbody>
              </table>
            </div>

            <footer style={{margin: '64px 0'}}>

            </footer>

          </div>
        </div>
      )
    } else {
      return (
        <div className="w3-container">
          <p> Your test result is not ready yet. Please come back later </p>
        </div>
      )
    }
  }
}
