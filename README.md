# /yafsn/ - yet another svelte navigator

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/jkbz64/yafsn/Build%20package/master)
![npm](https://img.shields.io/npm/v/yafsn)
![NPM](https://img.shields.io/npm/l/yafsn)
![Svelte](https://img.shields.io/badge/svelte-3.x-yellow)

## Motivation
There is a lot of navigation solutions for svelte but many of them are somewhat complicated/or they provide more features than you need with a bunch of extra steps to even begin.
- Do you need "production ready" solution for navigation?
- Do you need accessibility?
- Do you need SSR?
- Do you need "insert feature you won't ever use"?

If your answer to the questions above is __NO__, then you are in good place.

## Installation

`npm install yafsn`

## Usage

```svelte
// A.svelte - first screen
<script>
  import { getContext } from "svelte";
  const { navigate } = getContext("navigator");
  
  export let text = "World";
  
  function goToB() {
    navigate("B");
  }
</script>

<p>Hello {text}</p>
<button on:click={goToB}>Go to B</button>

// B.svelte - second screen
<script>
  import { getContext } from "svelte";
  const { navigate } = getContext("navigator");
  
  function goToA() {
    navigate("A", { text: "Earth" });
  }
</script>

<p>When we go back to A, Hello World will become Hello Earth</p>
<button on:click={goToA}>Go to A</button>

// App.svelte
<script>
  import { setContext } from "svelte";
  import { createNavigator, makeScreen } from "yafsn";
  
  import A from "./A.svelte";
  import B from "./B.svelte";
  
  const screens = {
    A: makeScreen({ component: A }),
    B: makeScreen({ component: B })
  }
  
  const navigator = createNavigator({ screens });
  setContext("navigator", navigator);
  
  const { screen, navigate } = navigator;
  navigate("A");
</script>

<svelte:component
  this={$screen?.component}
  {...$screen?.props}
/>
```

## License
[MIT](./LICENSE)
