<script>
  let { plan } = $props();
  let rowsInput = $state(3);
  let colsInput = $state(6);

  // Auto-resize when inputs change
  $effect(() => {
    const newRows = Math.max(1, Number(rowsInput) || 1);
    const newCols = Math.max(1, Number(colsInput) || 1);
    if (newRows !== plan.rows || newCols !== plan.cols) {
      plan.resize(newRows, newCols);
    }
  });
</script>

<div class="resize">
  <input type="number" min="1" bind:value={rowsInput} />
  <span class="separator">×</span>
  <input type="number" min="1" bind:value={colsInput} />
</div>

<style>
  .resize {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    background: var(--color-white);
  }

  .resize input[type="number"] {
    width: 3rem;
    padding: var(--spacing-xs);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-sm);
    background: var(--color-white);
    text-align: center;
    font-size: var(--font-size-sm);
  }

  .resize input[type="number"]:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  .separator {
    color: var(--color-gray-600);
    font-weight: bold;
    font-size: var(--font-size-lg);
  }
</style>
