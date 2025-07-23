import { createState } from "../../../framework/core/state.js";
import { Navigation } from "../partials/navigation.js";

const codeExample = `
  const [input, setInput] = createState("");
  const [submitted, setSubmitted] = createState("");
  
  export function FormPage() {

  function handleInput(event) {
    setInput(event.target.value);
  }
  function handleSubmit(event) {
    setSubmitted(input.value);
  }

  return {
    tag: "form",
    props: { onSubmit: handleSubmit },
    children: [
      {
        tag: "input",
        props: {
          type: "text",
          value: input.value,
          onInput: handleInput,
          placeholder: "Type something...",
        },
      },
      {
        tag: "button",
        props: { type: "submit" },
        children: ["Submit"],
      },
      submitted.value && {
        tag: "div",
        children: [\`You submitted: \${submitted.value}\`],
      },
    ],
  };
}
`;

const [input, setInput] = createState("");
const [submitted, setSubmitted] = createState("");
// Local form state
export function FormPage() {
  function handleInput(event) {
    setInput(event.target.value);
  }
  function handleSubmit(event) {
    setSubmitted(input.value); // Set submitted state to input value
  }

  return {
    tag: "div",
    children: [
      Navigation(),
      { tag: "h1", children: ["Form Example"] },
      {
        tag: "p",
        children: [
          "This page demonstrates form handling, input state, and preventing default submission.",
        ],
      },

      {
        tag: "form",
        props: {
          onSubmit: handleSubmit,
          preventDefault: ["onSubmit"],
        },
        children: [
          {
            tag: "input",
            props: {
              type: "text",
              value: input.value,
              onInput: handleInput,
              placeholder: "Type something...",
            },
          },
          {
            tag: "button",
            props: { type: "submit" },
            children: ["Submit"],
          },
        ],
      },
      submitted.value && {
        tag: "div",
        children: [`You submitted: ${submitted.value}`],
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
          "This example shows how to manage form state and handle input changes using the framework's state management.",
        ],
      },
    ],
  };
}
