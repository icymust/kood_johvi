// Support event types for delegation
const delegatedEvenets = [
  "click",
  "input",
  "change",
  "submit",
  "focus",
  "blur",
];

// Map event type -> set of { selector, handler }
const eventRegistry = {};

export function delegateEvent(eventType, selector, handler) {
  if (!eventRegistry[eventType]) {
    eventRegistry[eventType] = new Set();
    document.body.addEventListener(
      eventType,
      (event) => {
        // Check if the event target matches any registered selectors
        for (const { selector, handler } of eventRegistry[eventType]) {
          if (event.target.closest(selector)) {
            handler.call(event.target, event);
          }
        }
      },
      true
    ); // Use capture to catch events early
  }
  eventRegistry[eventType].add({ selector, handler });
  // Return a unsubscribe function
  return () => eventRegistry[eventType].delete({ selector, handler });
}

// Used by createElement to attach events (delegated or direct)
export function attachEvent(element, eventType, handler) {
  // If the element has an ID or data attribute, use delegation
  if (delegatedEvenets.includes(eventType)) {
    // Use delegation for common events
    if (element.id) {
      return delegateEvent(eventType, `#${element.id}`, handler);
    } else if (element.className) {
      return delegateEvent(
        eventType,
        `.${element.className.split(" ").join(".")}`,
        handler
      );
    } else {
      // Check for data attributes
      const dataAttributes = Array.from(element.attributes).filter((attr) =>
        attr.name.startsWith("data-")
      );
      if (dataAttributes.length > 0) {
        const selector = `[${dataAttributes[0].name}="${dataAttributes[0].value}"]`;
        return delegateEvent(eventType, selector, handler);
      }
    }
  }
  // Fallback direct event
  return addEventListener(element, eventType, handler);
}
