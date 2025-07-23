import { mount, unmount, replace, find } from "../../../framework/utils/dom.js";
import { Navigation } from "../partials/navigation.js";

const codeExample = `export function DomPage() {
  let mountedNode = null;
  function handleMount() {
    const node = document.createElement("div");
    node.textContent = "This is a dynamically mounted node.";
    mount(node, document.getElementById("dom-demo-mount"));
    mountedNode = node;
  }
  function handleUnmount() {
    if (mountedNode) {
      unmount(mountedNode);
      mountedNode = null;
    }
  }
  function handleReplace() {
    const oldNode = find("#dom-demo-replace span");
    const newNode = document.createElement("span");
    newNode.textContent = "This node has replaced the previous one.";
    replace(oldNode, newNode);
  }
  return {
    tag: "div",
    children: [
      {
        tag: "div",
        props: { id: "dom-demo-mount" },
        children: [
          { tag: "button", props: { onClick: handleMount }, children: ["Mount Node"] },
          { tag: "button", props: { onClick: handleUnmount }, children: ["Unmount Node"] },
        ],
      },
      {
        tag: "div",
        props: { id: "dom-demo-replace" },
        children: [
          "Replace Node Example - ",
          { tag: "span", props: { id: "dom-demo-find-span" }, children: ["This node will be replaced."] },
          { tag: "button", props: { onClick: handleReplace }, children: ["Replace Node"] },
        ],
      },
      {
        tag: "div",
        children: [
          "Find Node Example - ",
          {
            tag: "button",
            props: {
              onClick: () => {
                const foundNode = find("#dom-demo-find-span");
                alert(foundNode ? foundNode.textContent : "Not found!");
              },
            },
            children: ["Find Node"],
          },
        ],
      },
    ],
  };
}
`;

export function DomPage() {
  let mountedNode = null; // Track the mounted node
  let replacedNode = null; // Track the replaced node

  function handleMount() {
    const node = document.createElement("div");
    node.textContent = "This is a dynamically mounted node.";
    mount(node, document.getElementById("dom-demo-mount"));
    mountedNode = node; // Store the mounted node
  }

  function handleUnmount() {
    if (mountedNode) {
      unmount(mountedNode);
      mountedNode = null; // Clear the mounted node reference
    }
  }

  function handleReplace() {
    const oldNode = find("#dom-demo-replace span"); // Find the first child of the demo container
    const newNode = document.createElement("span");
    newNode.textContent = "This node has replaced the previous one.";
    replace(oldNode, newNode);
    replacedNode = newNode; // Store the replaced node
  }

  return {
    tag: "div",
    children: [
      Navigation(),
      { tag: "h1", children: ["DOM Manipulation Example"] },
      {
        tag: "p",
        children: [
          "This page demonstrates direct DOM manipulation using the framework's utility functions.",
        ],
      },
      {
        tag: "div",
        props: { id: "dom-demo-mount", style: "margin-bottom: 1em;" },
        children: [
          {
            tag: "button",
            props: { onClick: handleMount },
            children: ["Mount Node"],
          },
          {
            tag: "button",
            props: { onClick: handleUnmount },
            children: ["Unmount Node"],
          },
        ],
      },

      {
        tag: "div",
        props: { id: "dom-demo-replace", style: "margin-bottom: 1em;" },
        children: [
          "Replace Node Example - ",
          {
            tag: "span",
            props: { id: "dom-demo-find-span" },
            children: ["This node will be replaced."],
          },
          {
            tag: "button",
            props: { onClick: handleReplace, style: "margin-left: 1em;" },
            children: ["Replace Node"],
          },
        ],
      },
      {
        tag: "div",
        children: [
          "Find Node Example - ",
          {
            tag: "button",
            props: {
              onClick: () => {
                const foundNode = find("#dom-demo-find-span");
                alert(foundNode ? foundNode.textContent : "Not found!");
              },
            },
            children: ["Find Node"],
          },
        ],
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
          "This example shows how to mount, unmount, and replace DOM nodes using the framework's utility functions.",
        ],
      },
    ],
  };
}
