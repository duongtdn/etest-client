"use strict"

import React, { Component } from 'react'

import { xhttp } from 'authenform-utils'

import UserNotSignedIn from './UserNotSignedIn'

import { formatDate } from '../lib/date'

class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      error: null,
      loading: true
    }
  }
  componentDidMount() {
    if (!getResultIdFromHref()) {
      this.setState({ loading: false, error: '400'})
      return
    }
    this._loadResult()
  }
  render() {
    if (this.state.loading) { return (null) }
    if (this.state.error) {
      return (
        <div >
          <div className="w3-container">
            <h3 className="w3-text-red" style={{ padding: '32px 0px'}}> Error: {this.state.error} </h3>
          </div>
        </div>
      )
    }
    return(
      <div >
        <div className="w3-container">
          <h3 className="w3-text-blue"> <i className="fa fa-calendar" /> Test Result Report </h3>
          <hr />
          {
            this.state.data ? this._renderResult() : this._renderNoResult()
          }
        </div>
      </div>
    )
  }
  _renderNoResult() {
    return (
      <div>
        <p> Your test result is not ready yet. Please come back later </p>
      </div>
    )
  }
  _renderResult() {
    const test = this.state.data
    const user = this.props.user
    const tag = `w3-tag ${test.result.status==='passed'?'w3-green':'w3-red'}`
    return (
      <div>
        <h4 style={{fontWeight: 'bold'}}>
          <img className="w3-circle"style={{width: '40px'}} src={this.props.template.avata.male} />
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
                <td> <span > {test.result.detail.totalScore} </span> {' '} pt. </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{margin: '24px 0'}}>
          <p className="w3-text-blue-grey w3-small w3-border-bottom"> Result Detail </p>
          <table className="w3-table">
            <tbody className="">{
              test.content.sections.map(section => {
                const result = test.result.detail.sectionScores.filter(s => s.id === section.id)[0]
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
    )
  }
  _loadResult() {
    const urlBasePath = this.props.urlBasePath || ''
    const resultId = this.props.resultId
    xhttp.get( `${urlBasePath}/result?r=${resultId}`,
      { authen: true },
      (status, response) => {
        const loading = false
        if (status === 200) {
          const data = JSON.parse(response).data
          this.setState({ data, loading })
        } else {
          this.setState({ error: status, loading })
        }
      }
    )
  }
}


export default class ResultApp extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (this.props.user === null) {
      return ( null )
    }
    if (this.props.user === undefined) {
      return ( <UserNotSignedIn /> )
    }
    return (
      <Result urlBasePath = {this.props.urlBasePath}
              template = {this.props.template}
              resultId = {getResultIdFromHref()}
              user = {this.props.user}
              accountClient = {this.props.accountClient}
      />
    )
  }
}

function getResultIdFromHref() {
  const href = window.location.href.split('?')
  if (!href[1]) {
    return undefined
  }
  const query = href[1].split('=')
  const param = query[0]
  const resultId = query[1]
  if (param === 'r') {
    return resultId
  } else {
    return undefined
  }
}
