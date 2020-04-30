"use strict"

import React, { Component } from 'react'

import mq from 'media-query'
import xhttp from '@realmjs/xhttp-request'
import { nav } from '@realmjs/react-navi'

import storage from '../../lib/storage'

import Header from '../Widgets/Header'
import Title from '../Widgets/Title'
import StatusBar from '../Widgets/StatusBar'
import QuizBoard from '../Widgets/QuizBoard'
import PopupAllQuizzes from '../Popup/AllQuizzes'
import PopupEnding from '../Popup/Ending'
import PopupRetry from '../Popup/Retry'
import Toast from '../Popup/Toast'

const TOAST_TIMEOUT = 2500;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerOnOff: 'off',
      showPopupAllQuizzes: false,
      currentIndex: 0,
      lockSubmitBtn: false,
    };
    this.startAt = 0;
    props.page.onEnter( _ => this.setState({ timerOnOff: 'on' }));
    const bindMethods = [
      'nextQuiz', 'previousQuiz', 'pinQuiz', 'unpinQuiz',
      'updateAnswers', 'getSavedAnswers', 'updateInternalState', 'getSavedInternalState', 'submitAnswers', 'submitAllAnswers',
      'showPopupAllQuizzes', 'showPopupEnding', 'timeout', 'finishTest', 'submitTestCompletion',
    ];
    bindMethods.forEach( method => this[method] = this[method].bind(this) );
  }
  componentDidMount() {
    // console.log(this.props.test)
  }
  render() {
    if (!this.props.test) { return null }
    return (
      <div>
        <Header {...this.props} />
        <div className="w3-container" style={{maxWidth: '1200px', margin: 'auto'}}>
          <Title  title = {this.props.test.title} />
          <div className="w3-cell-row">
            {/* small device */}
            <div className="w3-cell" style={{verticalAlign: 'top'}}>
              <div className="w3-hide-medium w3-hide-large">
                <StatusBar  testDuration = {this.props.test.duration * 60}
                            startAt = {this.startAt}
                            timerOnOff = {this.state.timerOnOff}
                            moveToQuiz = {index => this.moveToQuiz(index)}
                            totalQuizzes = {Object.keys(this.props.test.content.questions).length}
                            onTimeout = {this.timeout}
                            showPopupAllQuizzes = {this.showPopupAllQuizzes}
                            finishTest = {this.showPopupEnding}
                            disabled = {!mq.isSmall()}
                            {...this.props}
                />
              </div>
              <QuizBoard  tests = {this.props.test}
                          currentIndex = {this.state.currentIndex}
                          next = {this.nextQuiz}
                          previous = {this.previousQuiz}
                          pinQuiz = {this.pinQuiz}
                          unpinQuiz = {this.unpinQuiz}
                          updateAnswers = {this.updateAnswers}
                          getSavedAnswers = {this.getSavedAnswers}
                          updateInternalState = {this.updateInternalState}
                          getSavedInternalState = {this.getSavedInternalState}
                          submitAnswers = {this.submitAnswers}
                          lockSubmitBtn = {this.state.lockSubmitBtn}
              />
            </div>
            {/* large & medium device */}
            <div className="w3-cell w3-hide-small" style={{verticalAlign: 'top', padding:'8px 0 8px 16px', width: '154px'}}>
              <StatusBar  testDuration = {this.props.test.duration * 60}
                          startAt = {this.startAt}
                          timerOnOff = {this.state.timerOnOff}
                          moveToQuiz = {index => this.moveToQuiz(index)}
                          totalQuizzes = {Object.keys(this.props.test.content.questions).length}
                          onTimeout = {this.timeout}
                          showPopupAllQuizzes = {this.showPopupAllQuizzes}
                          finishTest = {this.showPopupEnding}
                          disabled = {mq.isSmall()}
                          {...this.props}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  moveToQuiz(index) {
    this.setState({ currentIndex: index, lockSubmitBtn: false, });
  }
  nextQuiz() {
    const currentIndex = this.state.currentIndex;
    if (currentIndex < this.props.test.content.questions.length - 1) {
      // this.submitAnswers();
      this.moveToQuiz(currentIndex+1);
    } else {
      this.showPopupEnding();
    }
  }
  previousQuiz() {
    const currentIndex = this.state.currentIndex
    if (currentIndex > 0) {
      // this.submitAnswers();
      this.moveToQuiz(currentIndex-1);
    }
  }
  submitAnswers() {
    const storedQuizzes = this.__getQuizFromStorage();
    const submitted = storage.get(storage.SUBMITTEDKEY) || []
    const index = this.state.currentIndex
    if (storedQuizzes[index] === undefined) {
      return
    }
    if (submitted.indexOf(index) !== -1) {
      return
    }
    const submitting = [{
      index, userAnswers: storedQuizzes[index].answers
    }]
    this.setState({ lockSubmitBtn: true });
    this.sendAnswers(submitting)
    .then(() => {
      this.setState({ lockSubmitBtn: false });
      this.nextQuiz();
    })
    .catch(e => { this.setState({ lockSubmitBtn: false }); console.log(e) });
  }
  submitAllAnswers({ override = true }) {
    return new Promise((resolve, reject) => {
      const storedQuizzes = this.__getQuizFromStorage();
      const submitted = storage.get(storage.SUBMITTEDKEY) || [];
      // current quiz and quizzes that are in local storage but not in submitted list will be submitting
      const submitting = []
      for (let key in storedQuizzes) {
        if (submitted.indexOf(parseInt(key)) === -1 || (override && parseInt(key) === this.state.currentIndex)) {
          submitting.push({ index: parseInt(key), userAnswers: storedQuizzes[key].answers});
        }
      }
      if (submitting.length === 0) {
        resolve();
        return
      }
      this.setState({ lockSubmitBtn: true });
      this.sendAnswers(submitting)
      .then(() => {
        this.setState({ lockSubmitBtn: false });
        resolve();
      })
      .catch(e => reject(e));
    })
  }
  sendAnswers(answers) {
    const session = this.props.test.session;
    const urlBasePath = this.props.env.urlBasePath || '';
    return new Promise((resolve, reject) => {
      xhttp.put(`${urlBasePath}/exam/solution`, { session, questions: answers }, { authen: true, timeout: 15000 })
      .then( ({status}) => {
        if (status === 200) {
          this.__storeSubmittedQuizzes(answers);
          resolve();
        } else {
          nav.toast(Toast, {
            type: 'error',
            message: 'Failed to submit answer. Please continue with your test. Your answers will be submitted next time'
          }, self => setTimeout(self.close, TOAST_TIMEOUT));
          reject(status);
        }
      })
      .catch(err => {
        nav.toast(Toast, {
          type: 'error',
          message: 'Network Timeout. Please continue with your test. Your answers will be submitted next time'
        }, self => setTimeout(self.close, TOAST_TIMEOUT));
        reject(408);
      })
    })
  }
  finishTest() {
    this.submitAllAnswers({ override: false })
    .then(this.submitTestCompletion)
    .then( () => {
      storage.clear();
      this.props.route.navigate('finish');
    })
    .catch( err => {
      this.props.page.popup(PopupRetry, {overlay: true, retry: this.finishTest});
    });
  }
  submitTestCompletion() {
    return new Promise((resolve, reject) => {
      const session = this.props.test.session;
      const urlBasePath = this.props.env.urlBasePath || '';
      xhttp.put(`${urlBasePath}/exam/session`, { session, finish: true}, { authen: true, timeout: 15000 })
      .then( ({status}) => {
        if (status === 200) {
          resolve();
        } else {
          nav.toast(Toast, {
            type: 'error',
            message: `Error! Server returned code ${status}`
          }, self => setTimeout(self.close, TOAST_TIMEOUT));
          reject(status);
        }
      })
      .catch(err => {
        nav.toast(Toast, {
          type: 'error',
          message: 'Network Timeout. Please continue with your test. Your answers will be submitted next time'
        }, self => setTimeout(self.close, TOAST_TIMEOUT));
        reject(408);
      })
    })
  }
  pinQuiz(index) {
    const pinnedQuizzes = storage.get(storage.PINNEDKEY) || []
    if (pinnedQuizzes.indexOf(index) === -1) {
      pinnedQuizzes.push(index)
      storage.update(storage.PINNEDKEY, pinnedQuizzes)
    }
  }
  unpinQuiz(index) {
    const pinnedList = storage.get(storage.PINNEDKEY) || []
    const pinnedQuizzes = pinnedList.filter( _index => {
      return (index !== _index)
    })
    storage.update(storage.PINNEDKEY, pinnedQuizzes)
  }
  updateAnswers(answers) {
    const index = this.state.currentIndex
    const quiz = this.__getQuizFromStorage(index)
    if (JSON.stringify(answers) === JSON.stringify(quiz.answers)) {
      // answer is identical with cached one. No update
      return
    }
    quiz.answers = answers
    this.__storeQuizToStorage(index, quiz)
    // since answer has been changed, need to remove it from submitted list
    this.__removeSubmittedFromStorage(index)
  }
  getSavedAnswers() {
    const index = this.state.currentIndex
    const quiz = this.__getQuizFromStorage(index)
    return quiz.answers
  }
  updateInternalState(state) {
    const index = this.state.currentIndex
    const quiz = this.__getQuizFromStorage(index)
    quiz.state = state
    this.__storeQuizToStorage(index, quiz)
  }
  getSavedInternalState() {
    const index = this.state.currentIndex
    const quiz = this.__getQuizFromStorage(index)
    return quiz.state
  }
  timeout() {
    this.props.page.deleteAllPopups();
    this.showPopupEnding({timeout: true});
    setTimeout(() => {
      this.finishTest();
    }, 2000);
  }
  showPopupAllQuizzes() {
    this.props.page.popup(PopupAllQuizzes, { test: this.props.test })
    .then(index => index !== undefined && this.moveToQuiz(index));
  }
  showPopupEnding(options) {
    this.props.page.popup(PopupEnding, { test: this.props.test, timeout: options && options.timeout })
    .then(() => this.finishTest())
    .catch(e => console.log('ignored'));
  }
  __storeSubmittedQuizzes(answers) {
    const submittedQuizzes = storage.get(storage.SUBMITTEDKEY) || []
    answers.forEach(q => {
      if (submittedQuizzes.indexOf(q.index) === -1) {
        submittedQuizzes.push(q.index);
      }
    })
    storage.update(storage.SUBMITTEDKEY, submittedQuizzes);
  }
  __getQuizFromStorage(index) {
    const quizzes = storage.get(storage.QUIZZESKEY);
    if (quizzes) {
      return index !== undefined ? quizzes[index] || {} : quizzes;
    } else {
      return {}
    }
  }
  __storeQuizToStorage(index, quiz) {
    const quizzes = storage.get(storage.QUIZZESKEY) || {};
    quizzes[index] = quiz;
    storage.update(storage.QUIZZESKEY, quizzes);
  }
  __removeSubmittedFromStorage(quizIndex) {
    const submitted = storage.get(storage.SUBMITTEDKEY);
    if (submitted === null) {
      return
    }
    const index = submitted.indexOf(quizIndex);
    if (index > -1) { submitted.splice(index,1); }
    storage.update(storage.SUBMITTEDKEY, submitted);
  }
}
