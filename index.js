const { match } = require('path-to-regexp');

function routemeup (controllers, { method, url }) {
  for (const route in controllers) {
    const matched = match(route)(url);

    if (matched) {
      const controller = controllers[route];

      if (controller[method]) {
        return {
          controller: controller[method],
          tokens: matched.params
        };
      }

      if (controller[method.toUpperCase()]) {
        return {
          controller: controller[method.toUpperCase()],
          tokens: matched.params
        };
      }

      if (controller[method.toLowerCase()]) {
        return {
          controller: controller[method.toLowerCase()],
          tokens: matched.params
        };
      }

      return {
        controller: controller,
        tokens: matched.params
      };
    }
  }

  if (controllers.default) {
    return {
      controller: controllers.default
    };
  }

  throw new Error(`no controller found for method "${method}" on "${url}"`);
}

module.exports = routemeup;
