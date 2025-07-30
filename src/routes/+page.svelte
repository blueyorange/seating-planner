<script>
  const rows = 3;
  const cols = 6;

  let plan = $state({
    seats: Array(rows * cols).fill(null),
    unseated: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"],
  });

  function handleDrop(event, index) {
    event.preventDefault();
    if (plan.seats[index]) {
      // If the seat is already occupied, move the student to the unseated list
      const occupiedStudent = plan.seats[index];
      plan.unseated.push(occupiedStudent);
    }
    const nameToDrop = event.dataTransfer.getData("text/plain");
    plan.seats = plan.seats.map((s) => (s === nameToDrop ? null : s)); // set students with that name to null in seats
    plan.seats[index] = nameToDrop; // place the student in the dropped seat
    plan.unseated = plan.unseated.filter((s) => s !== nameToDrop); // remove the student from unseated
  }

  function handleDragStart(event, student) {
    event.dataTransfer.setData("text/plain", student);
  }

  function handleClear() {}
  function handleFill() {}
</script>

<header>
  <h1>Seating Planner</h1>
</header>

<main>
  <div class="container">
    <div
      class="grid"
      style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 60px); gap: 8px;"
      role="listbox"
    >
      {#each plan.seats as seat, i}
        <div
          draggable="true"
          ondragstart={(e) => handleDragStart(e, seat)}
          class="grid-item"
          ondrop={(e) => handleDrop(e, i)}
          ondragover={(e) => e.preventDefault()}
          style="background-color: {seat ? '#d4f7d4' : '#eee'}"
          role="option"
          aria-selected={seat ? "true" : "false"}
          tabindex="0"
        >
          {seat}
        </div>
      {/each}
    </div>
  </div>
  <ul class="students">
    {#each plan.unseated as student}
      <li draggable="true" ondragstart={(e) => handleDragStart(e, student)}>
        {student}
      </li>
    {/each}
  </ul>
</main>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
  }
  header {
    text-align: center;
    margin-bottom: 20px;
  }

  .container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
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
    cursor: grab;
    user-select: none;
  }

  .students {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    max-width: 200px;
  }

  .students li {
    padding: 8px;
    width: 100px;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin-bottom: 4px;
    cursor: grab;
  }

  .students li:hover {
    background-color: #f0f0f0;
  }
</style>
