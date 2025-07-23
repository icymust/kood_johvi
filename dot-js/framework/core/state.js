import { onRouteChange } from './router.js'; let currentUpdateFn = null;

export function setCurrentUpdateFn(fn) {
  currentUpdateFn = fn;
}

export function clearCurrentUpdateFn() {
  currentUpdateFn = null;
}

export function getCurrentUpdateFn() {
  return currentUpdateFn;
}

let stateIdCounter = 0;

export function createState(initialValue, key = null) {
  if (!key) {
    key = `state_${stateIdCounter++}`;
  }

  const resolveKey = (path) => `${key}:${path}`;

  let path = window.location.pathname;
  let storedValue = localStorage.getItem(resolveKey(path));
  let value = storedValue ? JSON.parse(storedValue) : initialValue;
  const subscribers = new Set();

  const state = {
    get value() {
      const fn = getCurrentUpdateFn();
      if (fn && !subscribers.has(fn)) {
        subscribers.add(fn);
      }
      return value;
    },
    set(newValue) {
      path = window.location.pathname;
      value = typeof newValue === 'function' ? newValue(value) : newValue;
      localStorage.setItem(resolveKey(path), JSON.stringify(value));
      subscribers.forEach(fn => fn());
    },
    __refresh() {
      path = window.location.pathname;
      const freshRaw = localStorage.getItem(resolveKey(path));
      const fresh = freshRaw ? JSON.parse(freshRaw) : initialValue;

      if (JSON.stringify(fresh) !== JSON.stringify(value)) {
        value = fresh;
        subscribers.forEach(fn => fn());
      }
    }
  };

  onRouteChange(() => {
    subscribers.clear();
    state.__refresh();
  });

  return [state, state.set.bind(state)];
}

export function createGlobalState(initialValue, key = null) {
  if (!key){
    key = 'globalState'
  }
  let storedValue = localStorage.getItem(key);
  let value = storedValue ? JSON.parse(storedValue) : initialValue;
  const subscribers = new Set();

  const state = {
    get value() {
      const fn = getCurrentUpdateFn();
      if (fn) subscribers.add(fn);
      return value;
    },
    set(newValue) {
      value = typeof newValue === 'function' ? newValue(value) : newValue;
      localStorage.setItem(key, JSON.stringify(value));
      subscribers.forEach(fn => fn());
    }
  };

  return state;
}

