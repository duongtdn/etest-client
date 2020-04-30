"use stric"

import React, { Component } from 'react'

import xhttp from '@realmjs/xhttp-request'
import { nav, Href } from '@realmjs/react-navi'

import storage from '../lib/storage'
import App from './App'
import Toast from './Popup/Toast'

const href = new Href();
const pathName = href.getPathName();
const { id } = href.getQuery() || {id :null};

export default class AppData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadContext: 'Tests',
      test: null,
    }
    this.action = {
      loadTest: this.loadTest.bind(this),
      loadResult: this.loadResult.bind(this),
    };
    this.loadAssets = this.loadAssets.bind(this);
  }

  render() {
    return (
      <App  id = {id}
            pathName = {pathName}
            action = {this.action}
            loadContext = {this.state.loadContext}
            test = {this.state.test}
            {...this.props}
      />
    )
  }

  loadTest(testId) {
    this.load(testId)('assets')
    .then(test => {
      storage.clear(storage.SESSIONKEY).update(storage.SESSIONKEY, test.session);
      this.setState({ loadContext: '', test });
      nav.navigate('exam');
    })
    .catch(err => {
      storage.clear();
      nav.toast(Toast, {type: 'error', message: `Operation failed. Returned code: ${err}`}, self => setTimeout(self.close, 2000));
      nav.navigate('intro');
    });
  }

  load(testId) {
    return () => {
      return new Promise((resolve, reject) => {
        const urlBasePath = this.props.env.urlBasePath || '';
        const session = storage.get(storage.SESSIONKEY);
        xhttp.post( `${urlBasePath}/exam/session`, { testId, session }, { authen: true })
        .then( ({status, responseText}) => {
          if (status === 201 || status === 200) {
            const test = JSON.parse(responseText);
            if (test.startAt) {
              const end = test.startAt + test.duration * 60 * 1000;
              const now = (new Date()).getTime();
              if (now > end) {
                reject(503);
                return
              }
            }
            this.loadAssets(test).then(() => resolve(test));
          } else {
            reject(status);
          }
        });
      });
    }
  }

  loadAssets(test) {
    this.setState({ loadContext: 'Assets' });
    const promises = [];
    for (let index in test.content.questions) {
      const question = test.content.questions[index]
      promises.push(this.parseQuestionProblem(question))
    }
    return Promise.all(promises);
  }

  loadResult(resultId) {
    // this.setState({ loadContext: 'Result' });
    const urlBasePath = this.props.env.urlBasePath || '';
    xhttp.get(`${urlBasePath}/result?r=${resultId}`, { authen: true })
    .then( ({status, responseText}) => {
      if (status === 404) {
        nav.navigate('error404');
        return
      }
      if (status === 200) {
        const test = JSON.parse(responseText);
        this.setState({test});
        return;
      }
      nav.toast(Toast, {type: 'error', message: `Operation failed. Returned code: ${status}`}, self => setTimeout(self.close, 2000));
    })
    .catch(err => {
      console.log(err)
    });
  }

  parseQuestionProblem(question) {
    const urlQuizzesBasePath = this.props.env.urlQuizzesBasePath || '';
    return new Promise((resolve, reject) => {
      // console.log(`--> Making request to ${urlQuizzesBasePath}/${question.problem}`)
      xhttp.get(`${urlQuizzesBasePath}/${question.problem}`)
      .then( ({status, responseText}) => {
        if (status === 200) {
          question.problem = responseText;
          resolve();
        } else {
          reject(status);
        }
      })
    })
  }

}
