const { match } = require('path-to-regexp');

function routemeup (controllers, { method, url }) {
  for (const route in controllers) {
    const matched = match(route)(url);

    if (matched) {
      const controller = controllers[route];
      const requestMethod = method.toUpperCase()
      
      if(typeof controller === 'function'){
        return {
          controller: controller,
          tokens: matched.params
        };
      }
      
      const controllerMethod = Object.keys(controller).find(key => key.toUpperCase() === requestMethod)

      if (controller[controllerMethod]) {
        return {
          controller: controller[method],
          tokens: matched.params
        };
      }
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
