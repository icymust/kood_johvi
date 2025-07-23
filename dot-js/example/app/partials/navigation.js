import { createRouter, navigateTo } from "../../../framework/core/router.js";

// Navigation
export function Navigation() {
  return {
    tag: "div",
    children: [
      {
        tag: "button",
        props: { onClick: () => navigateTo("/") },
        children: ["About"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/routing") },
        children: ["Routing"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/attributes") },
        children: ["Attribute"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/style") },
        children: ["Style"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/state") },
        children: ["State"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/http") },
        children: ["HTTP Demo"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/lazy") },
        children: ["Lazy Loading"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/form") },
        children: ["Form Example"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/dom") },
        children: ["DOM Manipulation"],
      },
      {
        tag: "button",
        props: { onClick: () => navigateTo("/todo") },
        children: ["ToDo"],
      },
    ],
  };
}
