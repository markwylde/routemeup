const test = require('tape');
const routemeup = require('../');

const basicControllers = {
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

  const match = routemeup(basicControllers, { url: '/test', method: 'get' });
  const result = match.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - found - no method', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/health', method: 'get' });
  const result = match.controller();

  t.equal(result, 'health:get');
});

test('basic routemeup - found - different case', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/test', method: 'GET' });
  const result = match.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - found - random case', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/test', method: 'Get' });
  const result = match.controller();

  t.equal(result, 'test:get');
});

test('basic routemeup - not found', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/not-found', method: 'get' });
  t.notOk(match);
});

test('basic routemeup - found - no method', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/not-found', method: 'patch' });
  const result = match.controller();
  t.equal(result, 'notfound');
});

test('basic routemeup - found - with tokens', t => {
  t.plan(1);

  const match = routemeup(basicControllers, { url: '/test/withToken', method: 'get' });
  const result = match.controller('firstArg', match.tokens);

  t.equal(result, 'test/firstArg/withToken:get');
});
