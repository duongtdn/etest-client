"use strict"

import React, { Component } from 'react'

import { Navigator } from '@realmjs/react-navi'

import PageIntro from './Page/Intro'
import PageLoading from './Page/Loading'
import PageError from './Page/Error'
import PageExam from './Page/Exam'
import PageFinish from './Page/Finish'
import PageResult from './Page/Result'

const routes = {
  intro: { Page: PageIntro },
  loading: { Page: PageLoading },
  error400: { Page: PageError, data: {code: 400, message: 'Bad query!' } },
  error404: { Page: PageError, data: {code: 404, message: 'Resource not found' } },
  exam: { Page: PageExam },
  finish: { Page: PageFinish },
  result: { Page: PageResult },
};

export default class App extends Component {
  constructor(props) {
    super(props);
    if (props.pathName.toLowerCase() === 'exam') {
      this.initialRoute = props.id ? 'intro' : 'error400';
    } else if (props.pathName.toLowerCase() === 'result') {
      this.initialRoute = props.id ? 'result' : 'error400';
    } else {
      this.initialRoute = 'error400';
    }
  }
  render() {
    return (
      <div>
        <Navigator  routes = {routes}
                    initialRoute = {this.initialRoute}
                    noUrl  = {true}
                    {...this.props}
        />
      </div>
    )
  }
}
