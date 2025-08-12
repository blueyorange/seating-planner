<script>
  let { checked = false, onToggle = () => {} } = $props();
  let toggleEl = $state(null);

  function handleClick() {
    onToggle();
  }

  function handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }
</script>

<button
  bind:this={toggleEl}
  class="toggle-button"
  class:checked
  onclick={handleClick}
  onkeydown={handleKeydown}
  role="switch"
  aria-checked={checked}
  tabindex="0"
>
  <div class="toggle-track">
    <div class="toggle-thumb"></div>
  </div>
  <span class="toggle-label">{checked ? "Student" : "Teacher"}</span>
</button>

<style>
  .toggle-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .toggle-button:hover {
    background-color: #f3f4f6;
  }

  .toggle-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .toggle-track {
    position: relative;
    width: 44px;
    height: 24px;
    background-color: #d1d5db;
    border-radius: 12px;
    transition: background-color 0.2s ease;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .toggle-button.checked .toggle-track {
    background-color: #3b82f6;
  }

  .toggle-button.checked .toggle-thumb {
    transform: translateX(20px);
  }

  .toggle-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 50px;
    text-align: left;
  }
</style>
