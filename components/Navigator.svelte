<script>
  import { setContext } from "svelte";
  import { createNavigator } from "yafsn";

  export let options = {};

  const navigator = createNavigator(options);
  setContext("navigator", navigator);

  const { screen } = navigator;
</script>

<svelte:component this={$screen?.component} {...$screen?.props || {}} />
