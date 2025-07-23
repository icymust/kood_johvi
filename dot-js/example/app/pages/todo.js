import { Navigation } from "../partials/navigation.js";
import { createState } from "../../../framework/core/state.js";
import { delegateEvent } from "../../../framework/core/events.js";

const [tasks, setTasks] = createState([], "todoTasks");
const [input, setInput] = createState("", "todoInput");
const [filter, setFilter] = createState("all", "todoFilter");
const [search, setSearch] = createState("", "todoSearch");

delegateEvent("click", ".delete-task", (event) => {
  const idx = parseInt(event.target.dataset.index, 10);
  setTasks((prev) => prev.filter((_, i) => i !== idx));
});

delegateEvent("change", ".toggle-task", (event) => {
  const idx = parseInt(event.target.dataset.index, 10);
  setTasks((prev) =>
    prev.map((task, i) => (i === idx ? { ...task, done: !task.done } : task))
  );
});

// Listen for the custom event only once
if (!window._todoCustomEventListener) {
  document.addEventListener("task-added", (e) => {
    alert("Custom event: Task added - " + e.detail);
  });
  window._todoCustomEventListener = true;
}

export function ToDo() {
  return {
    tag: "div",
    children: [
      Navigation(),
      { tag: "h1", children: ["ToDo App"] },

      // Search functionality
      {
        tag: "div",
        props: { style: { marginBottom: "1rem" } },
        children: [
          {
            tag: "input",
            props: {
              type: "text",
              value: search.value,
              placeholder: "Search tasks",
              onInput: (e) => setSearch(e.target.value),
            },
          },
        ],
      },

      // Add new task
      {
        tag: "div",
        props: { style: { marginBottom: "1rem" } },
        children: [
          {
            tag: "input",
            props: {
              type: "text",
              value: input.value,
              placeholder: "New task",
              onInput: (e) => setInput(e.target.value),
            },
          },
          {
            tag: "button",
            props: {
              onClick: () => {
                const val = input.value.trim();
                if (val) {
                  setTasks((prev) => [...prev, { text: val, done: false }]);
                  setInput("");
                  // Dispatch custom event
                  const event = new CustomEvent("task-added", { detail: val });
                  document.dispatchEvent(event);
                }
              },
              style: { color: "green", marginLeft: "0.5rem" },
            },
            children: ["Add"],
          },
        ],
      },

      // Filter tasks
      {
        tag: "div",
        props: { style: { marginBottom: "1rem" } },
        children: [
          {
            tag: "button",
            props: {
              onClick: () => setFilter("all"),
              style: {
                marginRight: "0.5rem",
                color: filter.value === "all" ? "blue" : "rgb(0 0 0 / 87%)",
              },
            },
            children: ["All"],
          },
          {
            tag: "button",
            props: {
              onClick: () => setFilter("active"),
              style: {
                marginRight: "0.5rem",
                color: filter.value === "active" ? "blue" : "rgb(0 0 0 / 87%)",
              },
            },
            children: ["Active"],
          },
          {
            tag: "button",
            props: {
              onClick: () => setFilter("completed"),
              style: {
                color:
                  filter.value === "completed" ? "blue" : "rgb(0 0 0 / 87%)",
              },
            },
            children: ["Completed"],
          },
        ],
      },

      // Task list
      {
        tag: "ul",
        children: tasks.value
          .filter((task) => {
            if (filter.value === "active") return !task.done;
            if (filter.value === "completed") return task.done;
            return true;
          })
          .filter((task) =>
            task.text.toLowerCase().includes(search.value.toLowerCase())
          )
          .map((task, idx) => ({
            tag: "li",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              },
            },
            children: [
              {
                tag: "input",
                props: {
                  type: "checkbox",
                  checked: task.done,
                  className: "toggle-task",
                  "data-index": idx,
                },
              },
              {
                tag: "span",
                props: {
                  style: {
                    textDecoration: task.done ? "line-through" : "none",
                    margin: "0 0.5rem",
                  },
                },
                children: [task.text],
              },
              {
                tag: "button",
                props: {
                  className: "delete-task",
                  "data-index": idx,
                  style: { color: "red" },
                },
                children: ["Delete"],
              },
            ],
          })),
      },

      // Clear all tasks
      {
        tag: "button",
        props: {
          onClick: () => setTasks([]),
          style: { color: "orange", marginTop: "1rem" },
        },
        children: ["Clear All"],
      },
    ],
  };
}
