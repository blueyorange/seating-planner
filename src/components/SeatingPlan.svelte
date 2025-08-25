<script>
  import Modal from "./Modal.svelte";
  import ImportNamesDialog from "./ImportNamesDialog.svelte";
  let { plan } = $props();
  let openImportNamesDialog = $state(false);

  // Auto-resize when inputs change
  $effect(() => {
    const newRows = Math.max(1, Number(rowsInput) || 1);
    const newCols = Math.max(1, Number(colsInput) || 1);
    if (newRows !== plan.rows || newCols !== plan.cols) {
      plan.resize(newRows, newCols);
    }
  });

  function handleDrop(event, index) {
    event.preventDefault();
    const nameToDrop = event.dataTransfer.getData("text/plain");
    plan.moveNameToIndex(index, nameToDrop);
  }

  function handleDragStart(event, student) {
    event.dataTransfer.setData("text/plain", student);
  }

  function handleClear() {
    plan.empty();
  }

  function handleFill() {
    plan.fill();
  }

  function handleShuffle() {
    plan.shuffle();
  }

  let rowsInput = $state(3);
  let colsInput = $state(6);

  function handleOpenImportDialog() {
    openImportNamesDialog = true;
  }

  function handleCloseImportDialog() {
    openImportNamesDialog = false;
  }
</script>

<main>
  <div class="container">
    <div class="controls">
      <div class="resize">
        <label>
          Rows
          <input type="number" min="1" bind:value={rowsInput} />
        </label>
        <label>
          Cols
          <input type="number" min="1" bind:value={colsInput} />
        </label>
      </div>
      <button class="btn-secondary" onclick={handleClear}>Clear</button>
      <button class="btn-secondary" onclick={handleFill}>Fill</button>
      <button class="btn-secondary" onclick={handleShuffle}>Shuffle</button>
      <button class="btn-primary" onclick={handleOpenImportDialog}
        >Import Names</button
      >
    </div>
    <div
      class="grid"
      style="grid-template-columns: repeat({plan.cols}, 1fr); grid-template-rows: repeat({plan.rows}, 60px); gap: 8px;"
      role="listbox"
    >
      {#each plan.seated as seat, i}
        <div
          draggable={seat !== null}
          ondragstart={(e) => handleDragStart(e, seat, i)}
          class="grid-item {seat ? 'occupied' : ''}"
          ondrop={(e) => handleDrop(e, i)}
          ondragover={(e) => e.preventDefault()}
          role="option"
          aria-selected={seat ? "true" : "false"}
          tabindex="0"
        >
          {seat}
        </div>
      {/each}
    </div>
  </div>
  {#if plan.unseated.length > 0}
    <div class="unseated-container">
      <h3>Unseated Students</h3>
      <ul class="students">
        {#each plan.unseated as student}
          <li draggable="true" ondragstart={(e) => handleDragStart(e, student)}>
            {student}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <Modal open={openImportNamesDialog}>
    <ImportNamesDialog {plan} onClose={handleCloseImportDialog} />
  </Modal>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }

  .controls {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-bottom: var(--spacing-xl);
  }

  .resize {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .resize label {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--color-gray-800);
  }

  .resize input[type="number"] {
    width: 4rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    background: var(--color-white);
  }

  .grid {
    display: grid;
    width: fit-content;
    overflow: hidden;
  }

  .grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    text-align: center;
    border: 1px solid var(--color-gray-300);
    background-color: var(--color-gray-200);
    cursor: default;
    user-select: none;
    transition: background-color var(--transition-base);
    font-size: var(--font-size-xl);
  }

  .grid-item.occupied {
    background-color: var(--color-success);
    color: var(--color-gray-800);
    cursor: grab;
  }

  .unseated-container {
    text-align: center;
    margin-top: var(--spacing-xl);
  }

  .unseated-container h3 {
    margin-bottom: var(--spacing-md);
    color: var(--color-gray-800);
    font-size: var(--font-size-lg);
  }

  .students {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-sm);
    max-width: 600px;
  }

  .students li {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-gray-100);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    cursor: grab;
    user-select: none;
    transition: background-color var(--transition-base);
  }

  .students li:hover {
    background-color: var(--color-gray-200);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
</style>
