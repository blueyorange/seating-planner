<script>
  let { plan } = $props();

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
</script>

<main>
  <div class="container">
    <div class="controls">
      <button onclick={handleClear}>Clear</button>
      <button onclick={handleFill}>Fill</button>
      <button onclick={handleShuffle}>Shuffle</button>
    </div>
    <div
      class="grid"
      style="grid-template-columns: repeat({plan.cols}, 1fr); grid-template-rows: repeat({plan.rows}, 60px); gap: 8px;"
      role="listbox"
    >
      {#each plan.seated as seat, i}
        <div
          draggable={seat !== null}
          ondragstart={(e) => handleDragStart(e, seat)}
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
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  .controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }

  .controls button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }

  .controls button:hover {
    background-color: #0056b3;
  }

  .grid {
    display: grid;
    width: fit-content;
    border-radius: 8px;
    overflow: hidden;
  }

  .grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    text-align: center;
    border: 1px solid #ccc;
    background-color: #eee;
    cursor: default;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .grid-item.occupied {
    background-color: #d4f7d4;
    cursor: grab;
  }

  .unseated-container {
    text-align: center;
    margin-top: 20px;
  }

  .unseated-container h3 {
    margin-bottom: 10px;
    color: #333;
  }

  .students {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    max-width: 600px;
  }

  .students li {
    padding: 8px 12px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: grab;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .students li:hover {
    background-color: #e9ecef;
  }
</style>
