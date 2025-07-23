import { Navigation } from "../partials/navigation.js";

// Component: about page
export function About() {
  return {
    tag: 'div',
    children: [
      Navigation(),
      { tag: 'h1', children: ['dot-js Framework'] },
      {
        tag: 'p',
        children: ['dot-js is a lightweight JavaScript frontend framework designed to help developers build interactive user interfaces without relying on existing libraries like React, Vue, or Angular. It offers core features such as component-based UI composition, state management, routing, event handling, HTTP helpers, and DOM utilities, with an emphasis on clarity, simplicity, and full control.']
      },
      { tag: 'h2', children: ['Features'] },
      { tag: 'ul', children: [
        { tag: 'li', children: ['Component architecture'] },
        { tag: 'li', children: ['Global state management with reactivity'] },
        { tag: 'li', children: ['URL-based routing'] },
        { tag: 'li', children: ['Form handling and event delegation'] },
        { tag: 'li', children: ['HTTP helpers'] },
        { tag: 'li', children: ['Lazy rendering'] },
        { tag: 'li', children: ['LocalStorage-based persistence'] },
        { tag: 'li', children: ['Fully documented'] }
      ] }
      
    ]
  };
}
