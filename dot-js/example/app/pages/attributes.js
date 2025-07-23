import { Navigation } from "../partials/navigation.js";

function BooleanPropsDemo() {
  return {
    tag: 'div',
    children: [
      { tag: 'h1', children: ['Attributes'] },
      { tag: 'p', children: [`Attributes are defined using props.`] },
      { tag: 'h2', children: ['Example'] },

      {
        tag: 'input',
        props: {
          type: 'text',
          placeholder: 'Required input',
          required: true
        }
      },

      {
        tag: 'input',
        props: {
          type: 'text',
          placeholder: 'Read-only input',
          readOnly: true,
          value: 'Cannot change this'
        }
      },

      {
        tag: 'input',
        props: {
          type: 'checkbox',
          checked: true
        }
      },

      {
        tag: 'button',
        props: {
          disabled: true
        },
        children: ['Disabled button']
      },

      {
        tag: 'div',
        props: {
          hidden: true
        },
        children: ['You should not see this']
      }
    ]
  };
}

// Attributes
export function Attributes() {
  return {
    tag: 'div',
    children: [
      Navigation(),
      BooleanPropsDemo(),
      {
        tag: 'pre',
        props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
        children: [
          `return {
          tag: 'div',
          children: [
            { tag: 'h2', children: ['Boolean Attributes Demo'] },

            {
              tag: 'input',
              props: {
                type: 'text',
                placeholder: 'Required input',
                required: true
              }
            },

            {
              tag: 'input',
              props: {
                type: 'text',
                placeholder: 'Read-only input',
                readOnly: true,
                value: 'Cannot change this'
              }
            },

            {
              tag: 'input',
              props: {
                type: 'checkbox',
                checked: true
              }
            },

            {
              tag: 'button',
              props: {
                disabled: true
              },
              children: ['Disabled button']
            },

            {
              tag: 'div',
              props: {
                hidden: true
              },
              children: ['You should not see this']
            }
          ]
        };`
        ]
      }
    ]
  };
}