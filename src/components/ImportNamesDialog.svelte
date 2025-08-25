<script>
  let { plan, onClose } = $props();
  let namesText = $state("");
  let inputElement = $state(null);

  function handleSubmit() {
    if (!namesText.trim()) {
      return;
    }

    // Parse names from text (split by newlines, commas, or semicolons)
    const names = namesText
      .split(/[\n,;]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length > 0) {
      plan.addNames(...names);
    }

    // Reset form and close dialog
    namesText = "";
    onClose();
  }

  function handleCancel() {
    namesText = "";
    onClose();
  }

  function handleKeydown(event) {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  }
</script>

<div class="dialog-content">
  <h2>Import Names</h2>

  <label for="names-text">
    Paste names (one per line, comma, or semicolon separated)
  </label>

  <textarea
    id="names-text"
    bind:value={namesText}
    bind:this={inputElement}
    onkeydown={handleKeydown}
    placeholder="Alice&#10;Bob&#10;Charlie&#10;David, Eve, Frank&#10;Grace; Heidi; Ivan"
    rows="8"
    cols="40"
  ></textarea>

  <div class="dialog-actions">
    <button type="button" class="btn-secondary" onclick={handleCancel}
      >Cancel</button
    >
    <button type="button" class="btn-primary" onclick={handleSubmit}
      >Import</button
    >
  </div>
</div>

<style>
  .dialog-content {
    padding: var(--spacing-2xl);
    min-width: 400px;
  }

  .dialog-content h2 {
    margin: 0 0 var(--spacing-lg) 0;
    color: var(--color-gray-800);
    font-size: var(--font-size-2xl);
  }

  .dialog-content label {
    display: block;
    margin-bottom: var(--spacing-sm);
    color: var(--color-gray-600);
    font-weight: 500;
  }

  .dialog-content textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--color-gray-300);
    border-radius: var(--border-radius-md);
    font-family: var(--font-family);
    font-size: var(--font-size-sm);
    resize: vertical;
    min-height: 120px;
    box-sizing: border-box;
  }

  .dialog-content textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .dialog-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }
</style>
