# routemeup
[![Build Status](https://travis-ci.org/markwylde/routemeup.svg?branch=master)](https://travis-ci.org/markwylde/routemeup)
[![David DM](https://david-dm.org/markwylde/routemeup.svg)](https://david-dm.org/markwylde/routemeup)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/routemeup)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/routemeup)](https://github.com/markwylde/routemeup/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/routemeup)](https://github.com/markwylde/routemeup/blob/master/LICENSE)

A light wrapper around the native inbuilt pbkdf2 crypto functions used for password hashing, exposing promises and callbacks.

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
    GET: (example, tokens) => `/users/${example}/${tokens.userId}:get`,
    POST: () => `/users/${example}/${tokens.userId}:post`
  },

  default: () => 'notfound'
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
  },

  default: (request, response, tokens) => {
    response.writeHead(404);
    response.write('Not Found')
    response.end();
  }
};

const server = http.createServer(function (request, response) {
  const {controller, tokens} = routemeup(controllers, request);
  controller(request, response, tokens)
}).listen(8000)
```

## License
This project is licensed under the terms of the MIT license.
