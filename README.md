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

If your answer to the questions above is **NO**, then you are in good place.

## Installation

`npm install yafsn`

## Usage

[Try it here](https://svelte.dev/repl/3f2688bad42e4263831ac7604b4f919f?version=3.44.0)

```svelte
// App.svelte
<script>
  import { setContext } from "svelte";
  import { createNavigator, makeScreen } from "yafsn";

  import A from "./A.svelte";
  import B from "./B.svelte";

  const screens = {
    A: makeScreen({ component: A }), // Custom screen options
    B: makeScreen(B) // or simplified form
  }

  const navigator = createNavigator({
    screens,
    initialScreen: "A" // OPTIONAL, accepts route name or result of makeScreen
  });
  setContext("navigator", navigator);

  const { screen, navigate } = navigator;
  navigate("A");
</script>

<svelte:component
  this={$screen?.component}
  {...$screen?.props}
/>
```

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
```

```svelte
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
```

## Helper components

This library exposes simple bare-bones navigator which you can tweak as much you like but if you want to just plug in the screens and call it a day there are some helper components.

Before using helper components make sure to dedupe `svelte` and `yafsn` dependency!
See:
[rollup](https://github.com/rollup/plugins/tree/master/packages/node-resolve#dedupe),
[vite](https://vitejs.dev/config/#resolve-dedupe)

```svelte
<script>
  import { makeScreen } from "yafsn";
  import Navigator from "yafsn/components/Navigator.svelte";

  import A from "./A.svelte";
  import B from "./B.svelte";

  const screens = {
    A: makeScreen({ component: A }),
    B: makeScreen(B)
  }

  // All of the screen can access navigator with getContext("navigator")
</script>

<Navigator
  options={{
    screens,
    initialScreen: "A"
  }}
/>

```

## License

[MIT](./LICENSE)
