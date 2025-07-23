import { Navigation } from "../partials/navigation.js";

import { createState, createGlobalState } from '../../../framework/core/state.js';
// Global shared state
const sharedCounter = createGlobalState(0, 'sharedCounter');
// Local counter state 
const [localCount, setLocalCount] = createState(0);

// Component: Counter with local state
export function State() {
  return {
    tag: 'div',
    children: [
      Navigation(),
      { tag: 'h1', children: [`State management`] },
      { tag: 'p', children: [`This framework uses createGlobalState to set global state and createState to set local state.`] },
      { tag: 'p', children: [`For global state, the first argument is the initial value, and the second argument is the name of the state.`] },
      { tag: 'p', children: [`Second argument is needed if you have more than one global state.`] },
      { tag: 'p', children: [`For local state, the first argument is the initial value.`] },
      { tag: 'p', children: [`States are saved to localStorage.`] },
      {
        tag: 'pre',
        props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
        children: [
          `const sharedCounter = createGlobalState(0,'sharedCounter');
const [localCount, setLocalCount] = createState(0);`
        ]
      },
      { tag: 'h2', children: [`Example`] },
      { tag: 'p', children: [`Here you'll see a shared counter and a local counter and how it behaves on different pages.`] },
      SharedCounter(),
      {
        tag: 'pre',
        props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
        children: [
          `tag: 'div',
    children: [
      { tag: 'p', children: ["Shared count: ${sharedCounter.value}"] },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v + 1) },
        children: ['Increment shared']
      },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v - 1) },
        children: ['decrement shared']
      }
    ]`
        ]
      },
      { tag: 'p', children: [`Local count: ${localCount.value}`] },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c + 1) },
        children: ['Increment local']
      },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c - 1) },
        children: ['Decrement local']
      },
      {
        tag: 'pre',
        props: { style: { backgroundColor: 'lightgrey', padding: '1rem', margin: '1rem' } },
        children: [
          `
      { tag: 'p', children: ["Local count: ${localCount.value}"] },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c + 1) },
        children: ['Increment local']
      },
      {
        tag: 'button',
        props: { onClick: () => setLocalCount(c => c - 1) },
        children: ['Decrement local']
      },
    ]`
        ]
      },
      { tag: 'h3', children: [`Another page example`] },
      {
        tag: 'iframe',
        props: { src: '/otherpage' },
        children: ['Decrement local']
      }
    ]
  };
}
export function OtherPage() {
  return {
    tag: 'div',
    children: [
      { tag: 'p', children: [`Shared count: ${sharedCounter.value}`] },
      { tag: 'p', children: [`Local count: ${localCount.value}`] }
    ]
  };
}
// Component: uses shared global state
function SharedCounter() {
  return {
    tag: 'div',
    children: [
      { tag: 'p', children: [`Shared count: ${sharedCounter.value}`] },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v + 1) },
        children: ['Increment shared']
      },
      {
        tag: 'button',
        props: { onClick: () => sharedCounter.set(v => v - 1) },
        children: ['decrement shared']
      }
    ]
  };
}
