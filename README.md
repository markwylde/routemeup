# routemeup
[![Build Status](https://travis-ci.org/markwylde/routemeup.svg?branch=master)](https://travis-ci.org/markwylde/routemeup)
[![David DM](https://david-dm.org/markwylde/routemeup.svg)](https://david-dm.org/markwylde/routemeup)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/routemeup)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/routemeup)](https://github.com/markwylde/routemeup/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/routemeup)](https://github.com/markwylde/routemeup/blob/master/LICENSE)

A simple url router that can work on the server or web client with minimal magic.

## Installation
```bash
npm install --save routemeup
```

## Example Usage
### Generic example
```javascript
const routemeup = require('routemeup');

const controllers = {
  '/users': {
    GET: () => 'users:get',
    POST: () => 'users:post'
  },

  '/users/:userId': {
    GET: (tokens) => `/users/${tokens.userId}`,
    PUT: (example, tokens) => `/users/${tokens.userId} with example argument ${example}`,
  }
};

const match = routemeup(controllers, { url: '/test/withToken', method: 'get' });
match.controller('exampleArg', match.tokens);
```

### Http server example
```javascript
const routemeup = require('routemeup');

const controllers = {
  '/users': {
    GET: (request, response, tokens) => {
      response.write('the users');
      response.end();
    },
    POST: (request, response, tokens) => {
      response.write('make a user');
      response.end();
    },
  },

  '/users/:userId': {
    GET: (request, response, tokens) => {
      response.write('the user ' + tokens.userId);
      response.end();
    },
    PUT: (request, response, tokens) => {
      response.write('change the user ' + tokens.userId);
      response.end();
    },
  }
};

const server = http.createServer(function (request, response) {
  const {controller, tokens} = routemeup(controllers, request);
  controller(request, response, tokens)
}).listen(8000)
```

### Web client example
```javascript
const routemeup = require('routemeup');

const controllers = {
  '/users': (tokens) => {
    document.body.innerHTML = 'This is the users page';
  }
};

const {controller, tokens} = routemeup(controllers, {url: location.href});
controller(tokens);
```


## License
This project is licensed under the terms of the MIT license.
