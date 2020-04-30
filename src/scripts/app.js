"use strict"

import React from 'react'
import { render} from 'react-dom'

import AccountClient from '@realmjs/account-client'
import { UserProvider } from '@realmjs/react-user'
import env from './env'

const acc = new AccountClient({
  app: env.app,
  baseurl: env.urlAccount
});

import AppData from '../Template/AppData'
import Error from '../Template/Page/Error'

acc.sso( (status, user) => {
  if (user) {
    console.log(user)
    render(
      <UserProvider accountClient = {acc} >
        <AppData env = {env}/>
      </UserProvider>,
      document.getElementById('root')
    );
  } else {
    render (<Error code = '401 Unauthorized' message = {`Please login from ${env.urlWebstore}`} />, document.getElementById('root'));
  }
})
