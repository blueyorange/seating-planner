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
    <button type="button" onclick={handleCancel}>Cancel</button>
    <button type="button" onclick={handleSubmit} class="primary">Import</button>
  </div>
</div>

<style>
  .dialog-content {
    padding: 24px;
    min-width: 400px;
  }

  .dialog-content h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 1.5rem;
  }

  .dialog-content label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
  }

  .dialog-content textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    min-height: 120px;
    box-sizing: border-box;
  }

  .dialog-content textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .dialog-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .dialog-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .dialog-actions button:not(.primary) {
    background-color: #6c757d;
    color: white;
  }

  .dialog-actions button:not(.primary):hover {
    background-color: #5a6268;
  }

  .dialog-actions button.primary {
    background-color: #007bff;
    color: white;
  }

  .dialog-actions button.primary:hover {
    background-color: #0056b3;
  }
</style>
