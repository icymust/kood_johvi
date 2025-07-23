# dot-js Framework

`dot-js` is a lightweight JavaScript frontend framework designed to help developers build interactive user interfaces without relying on existing libraries like React, Vue, or Angular. It offers core features such as component-based UI composition, state management, routing, event handling, HTTP helpers, and DOM utilities, with an emphasis on clarity, simplicity, and full control.

---

## 🏗️ Architecture Overview

- **Component System:** Build UI using reusable, composable functions. This encourages modularity and code reuse, making large apps easier to maintain.
- **State Management:** Centralized and local state with reactivity, enabling predictable data flow and easy sharing of state between components and pages.
- **Routing:** URL-based navigation and route handling, allowing for single-page applications with clean, bookmarkable URLs.
- **Event Handling:** Declarative event listeners in components, supporting both direct and delegated events for flexibility and performance.
- **HTTP Module:** Simple helpers for AJAX requests, abstracting away boilerplate and making data fetching straightforward.
- **DOM Utilities:** Abstracted DOM manipulation for performance and safety, letting you interact with the DOM when needed without breaking the reactive model.
- **Performance:** Designed for efficiency, with options for lazy rendering and virtual lists to handle large datasets smoothly.
- **Extensibility:** The framework is modular and upgradable. You can easily add new utilities or features by following the existing structure.

**Design Principles:**  
dot-js is built for clarity, simplicity, and full control. It avoids hidden magic, favors explicit code, and is designed to be easy to extend for your own needs.

---

## 🔧 Installation

1. **Clone the repo:**

```bash
git clone https://gitea.kood.tech/mohamedsakr/frontend-framework
```

2. **Folder structure should look like:**

```bash
  /framework          # Contains core framework code
  /example            # Example ToDo app using the framework
  /example/index.html # App entry point
```

3. **Install dependencies:**

```bash
npm install
```

4. **Run the example app:**

```bash
npm start run
```

5. **Open your browser at:**

```bash
http://localhost:8080
```

---

## 🚀 Getting Started

This section will walk you through creating your first dot-js app from scratch.

### 1. Create a "Hello World" Component

Create a new file, for example `hello.js`:

```js
export function HelloWorld() {
  return {
    tag: "div",
    props: { style: { fontSize: "2em", color: "green" } },
    children: ["Hello, world! Welcome to dot-js!"],
  };
}
```

### 2. Add Your Component to the Router

In your main app file (e.g., main.js), import your component and add it to the routes:

```js
import { createRouter } from "../../framework/core/router.js";
import { HelloWorld } from "./hello.js";

const routes = {
  "/": HelloWorld,
  // ...other routes
};

createRouter(routes, document.getElementById("app"));
```

### 3. Run the Example App

Make sure you have installed dependencies:

```bash
npm install
```

then start the development server

```bash
npm start
```

Open your browser at http://localhost:8080 and you should see your Hello World message.

### Next Steps

- Try editing your HelloWorld component to add more elements, styles, or interactivity.
- Explore the /example directory for more advanced usage, including state management, forms, HTTP requests, and event handling.
- Read the rest of this documentation for detailed explanations and code examples for each feature.

---

## 🧩 Features

### Routing

dot-js includes a simple router for SPA navigation:

```js
import { createRouter, navigateTo } from "../../framework/core/router.js";

const routes = {
  "/": About,
  "/routing": Routing,
  "/style": Style,
  "/attributes": Attributes,
  "/state": State,
  "/otherpage": OtherPage,
};
createRouter(routes, document.getElementById("app"));
```

- **createRouter({ routes, notFound })**: Define your routes and 404 handler.
- **navigateTo(path)**: Programmatically change the route.

**Tip:**
Use absolute paths matching your deployment folder structure.

---

### Creating a Component

```js

	     {
  	      tag: 'div',
              props: {
                className: 'test-box',
                style: {
                  backgroundColor: 'lightgreen',
                  padding: '10px',
                  borderRadius: '8px'
                },
                hidden: false,
              },
              children: [
                {
                  tag: 'p',
                  children: ['Styled box with boolean and style props']
                }
              ]
            };
```

- **tag** defines element type
- **props** add attributes and styles to element
- **children** is the content inside the element

---

### 🧠 State Management

This framework uses createGlobalState to set global state and createState to set local state.

For global state, the first argument is the initial value, and the second argument is the name of the state.

Second argument is needed if you have more than one global state.

For local state, the first argument is the initial value.

States are saved to localStorage.

```js
const sharedCounter = createGlobalState(0, "sharedCounter");
const [localCount, setLocalCount] = createState(0);
```

#### **Local state example**

```js
tag: 'div',
    children: [
      { tag: 'p', children: ["Shared count: 17"] },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v + 1) },
        children: ['Increment shared']
      },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v - 1) },
        children: ['decrement shared']
      }
    ]
```

#### **Global state example**

```js
  { tag: 'p', children: ["Local count: -4"] },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c + 1) },
        children: ['Increment local']
      },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c - 1) },
        children: ['Decrement local']
      }
```

---

### 🖱️ Event Handling

dot-js uses a hybrid event system:

- **Delegated events:** For common events (like `click`, `input`, `change`), a single listener is attached to the document body and handlers are dispatched based on selectors (id/class).
- **Direct events:** For custom or less common events, listeners are attached directly to elements.

#### **Usage**

Add event listeners as props in your components:

```js
createElement("button", { onClick: handleClick }, "Click me");
```

You can also use event delegation for dynamic elements:

```js
import { delegateEvent } from "../framework/core/events.js";

// Handle all clicks on elements with class 'dynamic-btn'
delegateEvent("click", ".dynamic-btn", (e) => {
  alert("Delegated click!");
});
```

---

#### Preventing Default and Bubbling

You can declaratively prevent default browser behavior and stop propagation by adding `preventDefault` or `stopPropagation` props:

```js
{
  tag: "form",
  props: {
    onSubmit: handleSubmit,
    preventDefault: ["onSubmit"] // or true for all events
  },
  children: [...]
}
```

**Note:**  
If you use these props, you do **not** need to call `event.preventDefault()` or `event.stopPropagation()` in your handler—the framework will do it for you.

**Cleanup:**  
If you dynamically remove elements and want to clean up delegated events, call the unsubscribe function returned by `delegateEvent` or `attachEvent`:

```js
const unsubscribe = delegateEvent("click", ".my-btn", handler);
// Later, when you remove the element:
unsubscribe();
```

#### **How dot-js Events Differ from addEventListener**

- **Declarative:** Attach listeners as props when rendering, not imperatively after DOM creation.
- **Delegation:** For common events, only one listener is attached at the root, improving performance for large trees.
- **Automatic cleanup:** Listeners are managed by the framework, reducing memory leaks.

#### **Custom Events**

You can use `addEventListener` for custom events:

```js
import { addEventListener } from "../framework/core/events.js";

addEventListener(myElement, "mycustomevent", (e) => {
  // handle custom event
});
```

---

### 🔗 HTTP Requests

Use the built-in HTTP helpers for AJAX:

```js
import { get, post, put, del } from "../framework/http/http.js";

async function loadData() {
  const data = await get("/api/data");
  // do something with data
}
```

- **get(url, options)**
- **post(url, data, options)**
- **put(url, data, options)**
- **del(url, options)**

All return a Promise and handle JSON automatically.

---

### 🛠️ DOM Utilities

dot-js provides utility functions for direct DOM manipulation, useful for advanced scenarios or integrating with non-dot-js code.

**Available utilities:**

- `mount(node, parent)`: Appends a node to a parent.
- `unmount(node)`: Removes a node from its parent.
- `replace(oldNode, newNode)`: Replaces an old node with a new one.
- `find(selector, parent = document)`: Finds the first matching element.

**Example usage (see the DOM Manipulation demo page):**

```js
import { mount, unmount, replace, find } from "../framework/utils/dom.js";

// Mount a node
const node = document.createElement("div");
node.textContent = "Mounted!";
mount(node, document.getElementById("mount-point"));

// Unmount a node
unmount(node);

// Replace a node
const oldNode = find("#replace-me");
const newNode = document.createElement("span");
newNode.textContent = "Replaced!";
replace(oldNode, newNode);

// Find a node
const found = find("#some-id");
```

---

### ⚡ Performance: Virtual/Lazy List

dot-js includes a `LazyList` component for efficiently rendering large lists. Only visible items are rendered to the DOM, improving speed and memory usage.

**Usage:**

```js
import { LazyList } from "../framework/performance/lazy.js";

function renderRow({ item, i }) {
  const row = document.createElement("div");
  row.textContent = `Row #${i + 1}: ${item}`;
  return row;
}

function MyBigList() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
  return createElement(LazyList, {
    items,
    itemHeight: 32,
    height: 320,
    renderItem: renderRow,
  });
}
```

**Props:**

- `items`: Array of data to render.
- `itemHeight`: Height of each row in pixels.
- `height`: Height of the list viewport in pixels.
- `renderItem`: Function `(item, index) => HTMLElement` to render each row.

---

## 👌 Best Practices

- Use small, pure functions for components.
- Prefer `createElement()` over string manipulation.
- Use `subscribe()` for reactive UI updates.
- Use `navigateTo()` to control routes programmatically.
- Keep state minimal and colocated where possible.
- State should be defined outside render blocks.
- Use HTTP helpers for all network requests.
- Use event delegation for lists or dynamic elements, and always use `e.preventDefault()` or `e.stopPropagation()` as needed in your handlers.
- Use `LazyList` for any list with hundreds or thousands of items to keep your app fast and responsive.

---

## 🧩 Extending the Framework

You can add new features by creating utility modules in the `framework/` directory.
Follow the existing module structure and export your functions for use in apps.

---

## 📝 Example Project

See the `/example` directory for a demo app showcasing:

- Component usage (with reusable and styled components)
- Local and global state management
- Routing between multiple pages
- Event handling (buttons, inputs, navigation)
- Boolean and style props
- Navigation and programmatic route changes
- **HTTP requests** (see "HTTP Demo" page)
- **Performance/lazy rendering** (see "Lazy Loading" page)
- **Form handling** (see "Form Example" page)
- **DOM utilities** (see "DOM Manipulation" page)

To run the example:

```bash
npm start
# Then open http://localhost:8080
```

---

## 📚 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

---

## ❓ FAQ

**Q: Can I use dot-js with TypeScript?**
A: Yes, but you may need to add type definitions.

**Q: Does dot-js support SSR?**
A: Not out of the box, but you can extend it.

**Q: How do I report bugs?**
A: Open an issue on the repository.

---

## License

MIT

---
