// framework/core/router.js

import { renderComponent, resetComponent } from './renderer.js';

let routes = {};
let rootElement = null;
const routeListeners = new Set();

export function createRouter(routeMap, root) {
  routes = routeMap;
  rootElement = root;

window.addEventListener('popstate', () => {
  renderCurrentRoute();
});

renderCurrentRoute();
}

export function navigateTo(path) {
  history.pushState({}, '', path);
  renderCurrentRoute();
}

function renderCurrentRoute() {
  const path = window.location.pathname;
  const Component = routes[path];

  routeListeners.forEach(fn => fn(path));

  if (Component) {
    resetComponent(rootElement);
    renderComponent(Component, {}, rootElement);
  } else {
    resetComponent(rootElement);
    rootElement.innerHTML = `<h1>404 — Not Found</h1>`;
  }
}

export function onRouteChange(fn) {
  routeListeners.add(fn);
  return () => routeListeners.delete(fn);
}