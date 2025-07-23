import { Navigation } from "../partials/navigation.js";

// Component: about page
export function Routing() {
  return {
    tag: 'div',
    children: [
      Navigation(),
      { tag: 'h1', children: ['Routing'] },
      { tag: 'p', children: ['For routing you need to define routes and mount the router.'] },
      {
        tag: 'pre',
        props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
        children: [
          `const routes = {
'/': About,
'/routing': Routing,
'/style': Style,
'/attributes': Attributes,
'/state': State,
'/otherpage': OtherPage
};
createRouter(routes, document.getElementById('app'));
`
        ]
      },
    ]
  };
}
