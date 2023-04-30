import test from 'basictap';
import routemeup from '../index.js';

const basicRoutes = {
  '/test': {
    GET: () => 'test:get',
    POST: () => 'test:post'
  },

  '/test#with-hash': {
    GET: () => 'test-with-hash:get'
  },

  '/test/:id': {
    GET: (example, tokens) => `test/${example}/${tokens.id}:get`,
    POST: () => 'test/1:post'
  },

  '/found': {
    GET: () => 'health:get'
  },

  '/health': () => 'health:get'
};

test('basic routemeup - found', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test', method: 'get' });
  const result = route.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - found with hash', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test#with-hash', method: 'get' });
  const result = route.controller();

  t.equal(result, 'test-with-hash:get');
});

test('routemeup controller is function- found - no method', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/health', method: 'get' });
  const result = route.controller();

  t.equal(result, 'health:get');
});

test('basic routemeup - found - different case', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test', method: 'GET' });
  const result = route.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - found - random case', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test', method: 'Get' });
  const result = route.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - not found', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/not-found', method: 'get' });
  t.notOk(route);
});

test('basic routemeup - route found - method not found', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/found', method: 'post' });
  t.notOk(route);
});

test('basic routemeup - found - no method', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/not-found', method: 'patch' });
  t.notOk(route);
});

test('basic routemeup - found - with tokens', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test/withToken', method: 'get' });
  const result = route.controller('firstArg', route.tokens);

  t.equal(result, 'test/firstArg/withToken:get');
});

test('basic routemeup - found - with urlencoded tokens', t => {
  t.plan(2);

  const route = routemeup(basicRoutes, { url: '/test/with%20Token', method: 'get' });
  const result = route.controller('firstArg', route.tokens);

  t.equal(route.tokens.id, 'with Token');
  t.equal(result, 'test/firstArg/with Token:get');
});

test('basic routemeup - found - with querystring', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test?a=1', method: 'get' });
  const result = route.controller('firstArg', route.tokens);

  t.equal(result, 'test:get');
});

test('routemeup - found - multiple URL parameters', t => {
  t.plan(1);

  const routes = {
    '/test/:param1/:param2': {
      GET: (example, tokens) => `test/${example}/${tokens.param1}/${tokens.param2}:get`,
    },
  };

  const route = routemeup(routes, { url: '/test/value1/value2', method: 'get' });
  const result = route.controller('firstArg', route.tokens);

  t.equal(result, 'test/firstArg/value1/value2:get');
});

test('routemeup - found - complex URL', t => {
  t.plan(1);

  const routes = {
    '/test/:id#section': {
      GET: (example, tokens) => `test/${example}/${tokens.id}#section:get`,
    },
  };

  const route = routemeup(routes, { url: '/test/42#section', method: 'get' });
  const result = route.controller('firstArg', route.tokens);

  t.equal(result, 'test/firstArg/42#section:get');
});

test('routemeup - found - special characters in route', t => {
  t.plan(1);

  const routes = {
    '/test/:param([a-z]+)': {
      GET: (example, tokens) => `test/${example}/${tokens.param}:get`,
    },
  };

  const route = routemeup(routes, { url: '/test/value', method: 'get' });

  if (route) {
    const result = route.controller('firstArg', route.tokens);
    t.equal(result, 'test/firstArg/value:get');
  } else {
    t.fail('Route not found');
  }
});
