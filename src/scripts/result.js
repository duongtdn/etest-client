"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import AccountClient  from '@realmjs/account-client'
import { UserProvider } from '@realmjs/react-user'

import ResultApp from '../Page/Result'

import env from './env'

const acc = new AccountClient({
  realm: env.realm,
  app: env.app,
  baseurl: env.urlAccount
})
acc.sso()

render(
  <UserProvider accountClient = {acc} >
    <ResultApp urlBasePath = {env.urlBasePath} template = {env.template} />
  </UserProvider>,
  document.getElementById('root')
)
