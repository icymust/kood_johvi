import { createRouter, navigateTo } from "../../framework/core/router.js";
import { About } from "./pages/about.js";
import { Style } from "./pages/style.js";
import { Attributes } from "./pages/attributes.js";
import { State } from "./pages/state.js";
import { OtherPage } from "./pages/state.js";
import { Routing } from "./pages/Routing.js";
import { HttpPage } from "./pages/http.js";
import { LazyPage } from "./pages/lazy.js";
import { FormPage } from "./pages/form.js";
import { DomPage } from "./pages/dom.js";
import { ToDo } from "./pages/todo.js";

// Define routes
const routes = {
  "/": About,
  "/routing": Routing,
  "/style": Style,
  "/attributes": Attributes,
  "/state": State,
  "/otherpage": OtherPage,
  "/http": HttpPage,
  "/lazy": LazyPage,
  "/form": FormPage,
  "/dom": DomPage,
  "/todo": ToDo,
};

// Mount router
createRouter(routes, document.getElementById("app"));
