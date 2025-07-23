import { get } from "../../../framework/http/http.js";
import { Navigation } from "../partials/navigation.js";

const codeExample = `export function HttpPage() {
  const [data, setData] = createState("Loading...");
  setTimeout(() => {
    get("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => setData(JSON.stringify(response, null, 2)))
      .catch((error) => setData(\`Error: \${error.message}\`));
  }, 0);

  return {
    tag: "div",
    children: [
      { tag: "h1", children: ["HTTP Example"] },
      { tag: "pre", children: [data.value] },
    ],
  };
}
`;

export function HttpPage() {
  let data = "Loading..."; // Initial loading state
  get("https://jsonplaceholder.typicode.com/posts/1") // Fetching data from a public API
    .then((response) => {
      data = JSON.stringify(response, null, 2); // Format the response as JSON
      document.getElementById("http-demo-data").textContent = data;
    })
    .catch((error) => {
      data = `Error: ${error.message}`;
      document.getElementById("http-demo-data").textContent = data;
    });

  return {
    tag: "div",
    children: [
      Navigation(),
      { tag: "h1", children: ["HTTP Example"] },
      {
        tag: "p",
        children: [
          "This page demonstrates fetching data from a remote API using the framework's HTTP helper.",
        ],
      },

      { tag: "pre", props: { id: "http-demo-data" }, children: [data] },
      { tag: "h2", children: ["Code Example"] },
      {
        tag: "pre",
        props: {
          style: {
            backgroundColor: "lightgrey",
            padding: "1rem",
            margin: "1rem",
          },
        },
        children: [codeExample],
      },
      {
        tag: "p",
        children: [
          "This example uses the `get` function to fetch data from a public API.",
        ],
      },
      {
        tag: "p",
        children: ["The response is displayed in a preformatted text block."],
      },
    ],
  };
}
