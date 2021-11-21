<script>
  import { setContext } from "svelte";

  let visible = false;
  let component = null;

  export let closable = true;

  function openOverlay() {
    visible = true;
  }

  function setComponent(nextComponent) {
    component = nextComponent;
    visible = true;
  }

  function closeOverlay() {
    visible = false;
    component = null;
  }

  setContext("overlay", {
    openOverlay,
    closeOverlay,
    setComponent,
  });
</script>

<slot />

{#if visible}
  <article on:click={closable ? closeOverlay : null}>
    <div>
      <svelte:component this={component} />
    </div>
  </article>
{/if}

<style>
  article {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);
  }

  div {
    position: relative;
  }
</style>
