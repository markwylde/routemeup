export interface RouteMap {
  [route: string]: Function | RequestMethodMap;
}

export interface RequestMethodMap {
  [method: string]: Function;
}

export interface RoutemeupResult {
  controller: Function;
  tokens: object;
}

export function routemeup(
  routes: RouteMap,
  options: {
    method: string;
    url: string;
  }
): RoutemeupResult | null;

export default routemeup;
