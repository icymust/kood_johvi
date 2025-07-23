export function Lazy({ items, itemsHeight = 30, height = 300, renderItem }) {
  const visibleCount = Math.ceil(height / itemsHeight) + 1; // +1 for buffer
  let start = 0;

  const container = document.createElement("div"); // Create the main container
  container.style.position = "relative";
  container.style.overflowY = "auto";
  container.style.height = `${height}px`;
  container.style.border = "1px solid #ccc";

  const spacer = document.createElement("div"); // Spacer to maintain scroll height
  spacer.style.height = `${items.length * itemsHeight}px`;
  container.appendChild(spacer);

  let rendered = []; // Array to keep track of rendered nodes

  // Function to render visible items
  function renderVisible() {
    const scrollTop = container.scrollTop; // Current scroll position
    start = Math.floor(scrollTop / itemsHeight); // Calculate the start index based on scroll position
    const end = Math.min(start + visibleCount, items.length); // Calculate the end index

    // Remove old nodes
    rendered.forEach((node) => node.remove());
    rendered = [];

    // Render new nodes
    for (let i = start; i < end; i++) {
      const node = renderItem(items[i], i); // Call the render function for each item
      node.style.position = "absolute";
      node.style.top = `${i * itemsHeight}px`;
      node.style.left = 0;
      node.style.right = 0;
      node.style.height = `${itemsHeight}px`;
      container.appendChild(node);
      rendered.push(node);
    }
  }

  container.addEventListener("scroll", renderVisible);
  renderVisible(); // Initial render
  return container;
}
