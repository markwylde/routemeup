const test = require('tape');
const routemeup = require('../');

const basicRoutes = {
  '/test': {
    GET: () => 'test:get',
    POST: () => 'test:post'
  },

  '/test/:id': {
    GET: (example, tokens) => `test/${example}/${tokens.id}:get`,
    POST: () => 'test/1:post'
  },

  '/health': () => 'health:get'
};

test('basic routemeup - found', t => {
  t.plan(1);

  const route = routemeup(basicRoutes, { url: '/test', method: 'get' });
  const result = route.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - found - no method', t => {
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
