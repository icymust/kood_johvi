import { Lazy } from "../../../framework/performance/lazy.js";
import { Navigation } from "../partials/navigation.js";

const codeExample = `export function LazyPage() {
  const items = Array.from({ length: 1000 }, (_, i) => \`Item \${i + 1}\`);
  return {
    tag: "div",
    children: [
      {
        tag: "div",
        props: {
          id: "lazy-list-container",
          ref: (el) => {
            if (!el._lazyMounted) {
              el.appendChild(
                Lazy({
                  items,
                  itemsHeight: 32,
                  height: 320,
                  renderItem: (item, i) => {
                    const row = document.createElement("div");
                    row.textContent = \`Row \${i + 1}: \${item}\`;
                    row.style.borderBottom = "1px solid #ccc";
                    row.style.padding = "8px";
                    return row;
                  },
                })
              );
              el._lazyMounted = true;
            }
          },
        },
      },
    ],
  };
}
`;

export function LazyPage() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
  return {
    tag: "div",
    children: [
      Navigation(),
      { tag: "h1", children: ["Lazy Loading Example"] },
      {
        tag: "p",
        children: [
          "This page demonstrates performant rendering of large lists using the Lazy component.",
        ],
      },
      {
        tag: "div",
        props: {
          id: "lazy-list-container",
          ref: (el) => {
            // Only mount once
            if (!el._lazyMounted) {
              el.appendChild(
                Lazy({
                  items,
                  itemsHeight: 32,
                  height: 320,
                  renderItem: (item, i) => {
                    const row = document.createElement("div");
                    row.textContent = `Row ${i + 1}: ${item}`;
                    row.style.borderBottom = "1px solid #ccc";
                    row.style.padding = "8px";
                    return row;
                  },
                })
              );
              el._lazyMounted = true;
            }
          },
        },
      },
      { tag: "h2", children: ["Code Example"] },
      {
        tag: "pre",
        props: { style: { backgroundColor: "#f5f5f5", padding: "1em" } },
        children: [codeExample],
      },
      {
        tag: "p",
        children: [
          "This example uses the Lazy component to efficiently render a large list of items.",
        ],
      },
    ],
  };
}
