import { match } from 'path-to-regexp';

function routemeup (routes, { method, url }) {
  const parsedUrl = new URL(url, 'http://example.com');
  const pathname = parsedUrl.pathname + parsedUrl.hash;

  for (const route in routes) {
    const matched = match(route, { decode: decodeURIComponent })(pathname);

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

export default routemeup;
