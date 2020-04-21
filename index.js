const { match } = require('path-to-regexp');

function routemeup (controllers, { method, url }) {
  for (const route in controllers) {
    const matched = match(route)(url);

    if (matched) {
      const controller = controllers[route];

      if (typeof controller === 'function') {
        return {
          controller: controller,
          tokens: matched.params
        };
      }

      if (method) {
        const requestMethod = method.toUpperCase();
        const controllerMethod = Object.keys(controller).find(key => key.toUpperCase() === requestMethod);

        return {
          controller: controller[controllerMethod],
          tokens: matched.params
        };
      }
    }
  }
}

module.exports = routemeup;
