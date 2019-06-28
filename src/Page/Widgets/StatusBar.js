"use strict"

import React, { Component } from 'react'

import storage from '../../lib/storage'
import CircleTag from './CircleTag'

class PinnedQuizesList extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    if (this.props.pinnedQuizzes.length > 0) {
      return (
        <div className="">
          {
            this.props.pinnedQuizzes.map( i => (
              <CircleTag  key={i} value = {i}
                          onClick={ e => {
                            this.props.onClick && this.props.onClick()
                            this.props.moveToQuiz(i)
                          }}
              />
            ))
          }
        </div>
      )
    } else {
      return (
        <div className="w3-text-blue w3-small" style={{fontStyle: 'italic'}}>
          There is no pinned quiz
        </div>
      )
    }
  }
}

export default class StatusBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eslapsedTime: 0,
      submitted: storage.get(storage.SUBMITTEDKEY) || [],
      pinned: storage.get(storage.PINNEDKEY) || [],
      showPinnedQuizzesInSmallScreen: false
    }
  }
  componentDidMount() {
    if (this.props.timerOnOff === 'on') {
      this.setState({ eslapsedTime : this.props.startAt })
      this.startEslapsedTimer()
    }
    this._sHandler = storage.observe(storage.SUBMITTEDKEY, (data) => {
      const submitted = data || []
      this.setState({ submitted })
    })
    this._pHandler = storage.observe(storage.PINNEDKEY, (data) => {
      const pinned = data || []
      this.setState({ pinned })
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.timerOnOff === 'on' && prevProps.timerOnOff === 'off') {
      this.startEslapsedTimer()
    }
  }
  componentWillUnmount() {
    this.stopEslapsedTimer()
    storage.observe(storage.SUBMITTEDKEY, this._sHandler, false)
    storage.observe(storage.PINNEDKEY, this._pHandler, false)
  }
  render() {
    const remainingTime = this.props.testDuration - this.state.eslapsedTime
    const timerColor = (this.props.testDuration/remainingTime > 3) ? 'red' : 'yellow'
    const completion = Math.floor((this.state.submitted.length / this.props.totalQuizzes) * 100)
    return(
      <div style={{margin: '8px 0'}}>
        {this._renderForLargeScreen({remainingTime, timerColor, completion})}
        {this._renderForMediumScreen({remainingTime, timerColor, completion})}
        {this._renderForSmallScreen({remainingTime, timerColor})}
      </div>
    )
  }
  _renderForMediumScreen({remainingTime, timerColor, completion}) {
    return (
      <div className="w3-hide-large w3-hide-small" >
        <button className = "w3-light-grey w3-text-blue-grey w3-padding w3-button" style={{width: '154px', marginBottom: '6px', cursor: 'pointer'}} onClick={this.props.finishTest}>
          <i className="fa fa-flag-checkered" /> Finish Test
        </button>
        <div className="w3-pale-green w3-padding w3-button" style={{textAlign: 'center', width: '154px', marginBottom: '6px', cursor: 'pointer'}} onClick={this.props.showAllQuizzesPopup}>
          <div className="w3-text-green w3-small"> Completion ({completion}%) </div>
          <div className="w3-text-green w3-large" style={{fontWeight: 'bold', marginTop: 0}}> {this.state.submitted.length}/{this.props.totalQuizzes} </div>
        </div>
        <div className={`w3-pale-${timerColor} w3-padding`} style={{textAlign: 'center', width: '154px', marginBottom: '6px'}}>
          <div className={`w3-text-${timerColor} w3-small`}> Time Left </div>
          <div className={`w3-text-${timerColor} w3-large`} style={{fontWeight: 'bold', marginTop: 0}}> {formatTime(remainingTime)} </div>
        </div>
        <div className="w3-pale-blue w3-padding  w3-cell-top w3-hide-small" style={{ textAlign: 'left', margin: '4px 0', width: '154px'}}>
          <div className="w3-text-blue w3-small"> Pinned questions </div>
          <div className="" style={{minHeight: '37px'}}>
            <PinnedQuizesList pinnedQuizzes={this.state.pinned} moveToQuiz={this.props.moveToQuiz} />
          </div>
        </div>
      </div>
    )
  }
  _renderForLargeScreen({remainingTime, timerColor, completion}) {
    return (
      <div className="w3-hide-medium w3-hide-small">
        <div style={{ width: '310px', marginBottom: '6px'}}>
          <button className = "w3-light-grey w3-text-blue-grey w3-padding w3-button" style={{width: '310px', marginBottom: '6px', cursor: 'pointer'}} onClick={this.props.finishTest}>
            <i className="fa fa-flag-checkered" /> Finish Test
          </button>
          <div className="w3-pale-green w3-padding" style={{display: 'inline-block', textAlign: 'center', width: '154px', marginRight: '2px', cursor: 'pointer'}} onClick={this.props.showAllQuizzesPopup}>
            <div className="w3-text-green w3-small"> Completion ({completion}%) </div>
            <div className="w3-text-green w3-large" style={{fontWeight: 'bold', marginTop: 0}}> {this.state.submitted.length}/{this.props.totalQuizzes} </div>
          </div>
          <div className={`w3-pale-${timerColor} w3-padding`} style={{display: 'inline-block', textAlign: 'center', width: '154px'}}>
            <div className={`w3-text-${timerColor} w3-small`}> Time Left </div>
            <div className={`w3-text-${timerColor} w3-large`} style={{fontWeight: 'bold', marginTop: 0}}> {formatTime(remainingTime)} </div>
          </div>
        </div>
        <div className="w3-pale-blue w3-padding w3-cell-top" style={{ textAlign: 'left', margin: '4px 0', width: '310px'}}>
          <div className="w3-text-blue w3-small"> Pinned questions </div>
          <div className="" style={{minHeight: '37px'}}>
            <PinnedQuizesList pinnedQuizzes={this.state.pinned} moveToQuiz={this.props.moveToQuiz} />
          </div>
        </div>
      </div>
    )
  }
  _renderForSmallScreen({remainingTime, timerColor}) {
    return (
      <div className="w3-hide-medium w3-hide-large" style={{marginBottom: '6px', position: 'relative'}}>
        <div className="w3-pale-green w3-small" style={{display: 'inline-block', textAlign: 'center', padding: '8px 12px', marginRight: '6px', cursor: 'pointer'}} onClick={this.props.showAllQuizzesPopup}>
          <i className="fa fa-check w3-text-green" />
          { ' '}
          <span className="w3-text-green" style={{fontWeight: 'bold', marginTop: 0}}>
            {this.state.submitted.length}/{this.props.totalQuizzes}
          </span>
          {' '}

        </div>
        <div className={`w3-pale-${timerColor} w3-small`} style={{display: 'inline-block', textAlign: 'center', padding: '8px 12px', marginRight: '6px'}}>
          <i className={`fa fa-hourglass-o w3-text-${timerColor}`} />
          {' '}
          <span className={`w3-text-${timerColor} `} style={{fontWeight: 'bold', marginTop: 0}}> {formatTime(remainingTime)} </span>
        </div>
        <div className="w3-pale-blue w3-cell-top w3-small" style={{display: 'inline-block', textAlign: 'left', padding: '8px 12px', marginRight: '6px'}}
             onClick={e => this.setState({ showPinnedQuizzesInSmallScreen: !this.state.showPinnedQuizzesInSmallScreen})}>
          <i className="fa fa-map-pin w3-text-blue" /> {' '}
          <span className="w3-text-blue" style={{fontWeight: 'bold', marginTop: 0}}>
            Quiz
          </span>
        </div>
        <div className={`w3-light-gray w3-small`} style={{display: 'inline-block', textAlign: 'center', padding: '8px 12px', marginRight: '2px'}} onClick={this.props.finishTest}>
          <i className={`fa fa-flag-checkered w3-text-blue-grey`} />
          <span className={`w3-text-${timerColor} `} style={{fontWeight: 'bold', marginTop: 0}}>  </span>
        </div>
        <div className={`w3-border-left w3-border-bottom w3-border-right w3-border-blue w3-pale-blue w3-padding ${this.state.showPinnedQuizzesInSmallScreen? '' : 'w3-hide'}`} style={{minHeight: '37px', position: 'absolute', width: '100%'}}>
          <PinnedQuizesList pinnedQuizzes={this.state.pinned} moveToQuiz={this.props.moveToQuiz} onClick={e => this.setState({ showPinnedQuizzesInSmallScreen: false})}/>
        </div>
      </div>
    )
  }
  startEslapsedTimer() {
    this._timer = setInterval(() => {
      const eslapsedTime = this.state.eslapsedTime + 1
      this.setState({ eslapsedTime })
      if (eslapsedTime === this.props.testDuration) {
        this.stopEslapsedTimer()
        this.props.onTimeout && this.props.onTimeout()
      }
    }, 1000)
  }
  stopEslapsedTimer() {
    clearInterval(this._timer)
  }
}

function formatTime(time) {
  const hh = Math.floor(time/3600)
  const mm = Math.floor((time%3600)/60)
  const ss = time - hh*3600 - mm*60
  return `${("00"+hh).slice(-2)}:${("00"+mm).slice(-2)}:${("00"+ss).slice(-2)}`
}
