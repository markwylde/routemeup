const { match } = require('path-to-regexp');

function routemeup (routes, { method, url }) {
  const pathname = (new URL(url, 'http://example.com')).pathname;

  for (const route in routes) {
    const matched = match(route)(pathname);

    if (matched) {
      const controller = routes[route];

      if (typeof controller === 'function') {
        return {
          controller: controller,
          tokens: matched.params
        };
      }

      if (method) {
        const requestMethod = method.toUpperCase();
        const controllerMethod = Object
          .keys(controller)
          .find(key => key.toUpperCase() === requestMethod);

        if (!controller[controllerMethod]) {
          return null;
        }

        return {
          controller: controller[controllerMethod],
          tokens: matched.params
        };
      }
    }
  }
}

module.exports = routemeup;
