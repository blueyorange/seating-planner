<script>
  let { children, open } = $props();

  let dialogEl;

  $effect(() => {
    if (open && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!open && dialogEl.open) {
      dialogEl.close();
    }
  });

  function handleClose() {
    open = false;
    dispatchEvent(new CustomEvent("close"));
  }
</script>

<dialog bind:this={dialogEl} onclose={handleClose}>
  {@render children()}
</dialog>
