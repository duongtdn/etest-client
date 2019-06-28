"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import AccountClient  from 'account-realm-client'
import { UserProvider } from 'react-user'

import ExamApp from '../Page/Exam'

import env from './env'

const acc = new AccountClient({
  realm: env.realm,
  app: env.app,
  baseurl: env.urlAccount
})
acc.sso()

render(
  <UserProvider accountClient = {acc} >
    <ExamApp urlBasePath = {env.urlBasePath} urlQuizzesBasePath = {env.urlQuizzesBasePath} template = {env.template} />
  </UserProvider>,
  document.getElementById('root')
)
