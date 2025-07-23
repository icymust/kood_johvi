import { attachEvent } from "./events.js";

export function createElement(tag, props = {}, ...children) {
  if (typeof tag === "function") {
    return tag(props, ...children);
  }

  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      // Use attachEvent to handle both direct and delegated events
      attachEvent(el, eventType, value);
    } else if (key === "class" || key === "className") {
      el.className = value;
    } else if (key.startsWith("data-")) {
      el.setAttribute(key, value);
    } else if (key in el) {
      el[key] = value;
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children.flat()) {
    const processed = processChild(child);
    if (processed) el.appendChild(processed);
  }

  return el;
}

function processChild(child) {
  if (typeof child === "string" || typeof child === "number") {
    return document.createTextNode(child);
  } else if (child instanceof HTMLElement) {
    return child;
  } else if (typeof child === "function") {
    return processChild(child());
  } else if (child && typeof child === "object" && "tag" in child) {
    return createElement(
      child.tag,
      child.props || {},
      ...(child.children || [])
    );
  }
  return null;
}

export function createComponent(ComponentFn, props = {}) {
  const vnode = ComponentFn(props);
  vnode._component = ComponentFn;
  vnode._props = props;
  return vnode;
}

export const Div = (props, ...children) =>
  createElement("div", props, ...children);
export const Button = (props, ...children) =>
  createElement("button", props, ...children);
export const Span = (props, ...children) =>
  createElement("span", props, ...children);
export const Input = (props) => createElement("input", props);
