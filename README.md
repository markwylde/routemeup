# routemeup
[![Build Status](https://travis-ci.org/markwylde/routemeup.svg?branch=master)](https://travis-ci.org/markwylde/routemeup)
[![David DM](https://david-dm.org/markwylde/routemeup.svg)](https://david-dm.org/markwylde/routemeup)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/routemeup)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/routemeup)](https://github.com/markwylde/routemeup/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/routemeup)](https://github.com/markwylde/routemeup/blob/master/LICENSE)

A simple url router that can work on a server or web client with minimal magic.

## Installation
```bash
npm install --save routemeup
```

## Example Usage
### Generic example
```javascript
const routemeup = require('routemeup');

const routes = {
  '/users': {
    GET: () => 'users:get',
    POST: () => 'users:post'
  },

  '/users/:userId': {
    GET: (tokens) => `/users/${tokens.userId}`,
    PUT: (example, tokens) => `/users/${tokens.userId} with example argument ${example}`,
  }
};

const route = routemeup(routes, { url: '/test/withToken', method: 'get' });
if (route) {
  return route.controller('exampleArg', route.tokens);
}
```

### Http server example
```javascript
const routemeup = require('routemeup');

const routes = {
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
  const route = routemeup(routes, request);
  if (route) {
    return route.controller(request, response, route.tokens)
  }

  response.writeHead(404);
  response.write('Not Found');
  response.end();
}).listen(8000)
```

### Web client example
```javascript
const routemeup = require('routemeup');

const routes = {
  '/users': (tokens) => {
    document.body.innerHTML = 'This is the users page';
  }
};

const route = routemeup(routes, {url: location.href});
if (route) {
  return controller(route.tokens);
}
```


## License
This project is licensed under the terms of the MIT license.
