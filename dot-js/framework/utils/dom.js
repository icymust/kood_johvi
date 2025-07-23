export function mount(node, parent) {
  parent.appendChild(node);
}
export function unmount(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
export function replace(oldNode, newNode) {
  if (oldNode.parentNode) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
  }
}
export function find(selector, parent = document) {
  return parent.querySelector(selector);
}
