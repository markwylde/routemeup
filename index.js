const { match } = require('path-to-regexp');

function routemeup (routes, { method, url }) {
  for (const route in routes) {
    const matched = match(route)(url);

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
