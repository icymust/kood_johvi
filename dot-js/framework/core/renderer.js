import { setCurrentUpdateFn, clearCurrentUpdateFn } from "./state.js";

export function render(vnode, container) {
  const el = resolveVNode(vnode);
  container.appendChild(el);
}

function resolveVNode(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode);
  }

  if (typeof vnode.tag === "function") {
    const wrapper = document.createElement("div");
    renderComponent(vnode.tag, vnode.props || {}, wrapper);
    return wrapper.firstChild;
  }

  const el = document.createElement(vnode.tag);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        // Check for preventDefault and stopPropagation
        const eventName = key.slice(2).toLowerCase();
        let handler = value;
        const prevent =
          vnode.props.preventDefault === true ||
          (Array.isArray(vnode.props.preventDefault) &&
            vnode.props.preventDefault.includes(key));
        const stop =
          vnode.props.stopPropagation === true ||
          (Array.isArray(vnode.props.stopPropagation) &&
            vnode.props.stopPropagation.includes(key));
        if (prevent || stop) {
          handler = function (e) {
            if (prevent) e.preventDefault();
            if (stop) e.stopPropagation();
            value(e);
          };
        }
        el.addEventListener(eventName, handler);
      } else if (key === "className") {
        el.setAttribute("class", value);
      } else if (key === "style") {
        if (typeof value === "string") {
          el.setAttribute("style", value);
        } else if (typeof value === "object") {
          for (const [styleKey, styleValue] of Object.entries(value)) {
            el.style[styleKey] = styleValue;
          }
        }
      } else if (key === "value" && el.tagName === "INPUT") {
        if (document.activeElement !== el && el.value !== value) {
          el.value = value;
        }
      } else {
        if (typeof value === "boolean") {
          if (value) {
            el.setAttribute(key, "");
          } else {
            el.removeAttribute(key);
          }
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  }
  const children = Array.isArray(vnode.children)
    ? vnode.children
    : vnode.children != null
    ? [vnode.children]
    : [];
  children.forEach((child) => {
    el.appendChild(resolveVNode(child));
  });
  //  (vnode.children || []).forEach(child => {
  //    el.appendChild(resolveVNode(child));
  //  });

  if (vnode.props && typeof vnode.props.ref === "function") {
    vnode.props.ref(el);
  }

  return el;
}

const oldVNodeMap = new Map();

export function renderComponent(Component, props, container) {
  function update() {
    setCurrentUpdateFn(update);
    const newVNode = Component(props);
    clearCurrentUpdateFn();

    const oldVNode = oldVNodeMap.get(container);

    if (!oldVNode) {
      container.innerHTML = "";
      container.appendChild(resolveVNode(newVNode));
    } else {
      patch(container, oldVNode, newVNode);
    }

    oldVNodeMap.set(container, newVNode);
  }

  update();
}

export function resetComponent(container) {
  oldVNodeMap.delete(container);
}

function patch(parent, oldVNode, newVNode, index = 0) {
  const child = parent.childNodes[index];
  if (!oldVNode) {
    parent.appendChild(resolveVNode(newVNode));
    return;
  }
  if (!newVNode) {
    if (child) parent.removeChild(child);
    return;
  }
  if (
    typeof oldVNode !== typeof newVNode ||
    (typeof newVNode === "string" && oldVNode !== newVNode) ||
    (typeof newVNode === "object" && oldVNode.tag !== newVNode.tag)
  ) {
    parent.replaceChild(resolveVNode(newVNode), child);
    return;
  }
  if (typeof newVNode === "string") {
    if (child.textContent !== newVNode) {
      child.textContent = newVNode;
    }
    return;
  }
  updateProps(child, oldVNode.props || {}, newVNode.props || {});

  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const maxLen = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLen; i++) {
    patch(child, oldChildren[i], newChildren[i], i);
  }
}

function updateProps(el, oldProps, newProps) {
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith("on") && typeof oldProps[key] === "function") {
        el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
      } else {
        el.removeAttribute(key);
      }
    }
  }

  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (key.startsWith("on") && typeof newValue === "function") {
      if (oldValue !== newValue) {
        if (oldValue) {
          el.removeEventListener(key.slice(2).toLowerCase(), oldValue);
        }
        el.addEventListener(key.slice(2).toLowerCase(), newValue);
      }
    } else if (key === "value" && el.tagName === "INPUT") {
      if (document.activeElement !== el && el.value !== newValue) {
        el.value = newValue;
      }
    } else if (key === "className") {
      el.setAttribute("class", newValue);
    } else if (key === "style") {
      if (typeof newValue === "string") {
        el.setAttribute("style", newValue);
      } else if (typeof newValue === "object") {
        for (const styleKey in newValue) {
          el.style[styleKey] = newValue[styleKey];
        }
      }
    } else if (typeof newValue === "boolean") {
      if (newValue) {
        el.setAttribute(key, "");
      } else {
        el.removeAttribute(key);
      }
    } else {
      if (oldValue !== newValue) {
        el.setAttribute(key, newValue);
      }
    }
  }
}
