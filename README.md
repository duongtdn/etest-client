# exam-client

## Precondition

Install local dependency

`npm link react-quiz`

## How to use

1- Start an account-realm server first

ex: `cd ~/work/account-realm-core && node tests/server`

2- Start exam-api-core server

ex: `cd ../exam-api-core && npm start`

3- Create a Test for test user

ex: `cd ../exam-api-core && node example/create-test`

4- Start webpack dev server

`npm start`

5- Copy the test session key, Open browser and enter below address

`http://localhost:3200/exam?t=created-session-key`


## Build Client Scripts

`npm run build`

Then, deploy `exam.js` and `result.js` into a CDN.

### Configure enviroment parameter

Set parameters in `src/scripts/env.js

