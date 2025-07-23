import { Navigation } from "../partials/navigation.js";
// Component: style
function StyledBox() {
  return {
    tag: 'div',
    props: {
      className: 'test-box',
      style: {
        backgroundColor: 'lightgreen',
        padding: '10px',
        borderRadius: '8px'
      },
      hidden: false,
    },
    children: [
      {
        tag: 'p',
        children: ['Styled box with boolean and style props']
      }
    ]
  };
}

// Component: home page
export function Style() {
  return {
    tag: 'div',
    children: [
      Navigation(),
      { tag: 'h1', children: ['Styles'] },
      { tag: 'p', children: [`Styles are defined using props.`] },
      { tag: 'h2', children: ['Example'] },
        StyledBox(),
          {
            tag: 'pre',
            props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
            children: [
              `return {
              tag: 'div',
              props: {
                className: 'test-box',
                style: {
                  backgroundColor: 'lightgreen',
                  padding: '10px',
                  borderRadius: '8px'
                },
                hidden: false,
              },
              children: [
                {
                  tag: 'p',
                  children: ['Styled box with boolean and style props']
                }
              ]
            };`
            ]
          }
    ]
  };
}
