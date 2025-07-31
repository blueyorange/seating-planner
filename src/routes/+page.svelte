<script>
  const rows = 3;
  const cols = 6;

  let plan = $state({
    seats: Array(rows * cols).fill(null),
    unseated: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"],
  });

  function handleDrop(event, index) {
    event.preventDefault();
    if (index < 0) {
      // If index is -1, drop into unseated list
      const nameToDrop = event.dataTransfer.getData("text/plain");
      if (!plan.unseated.includes(nameToDrop)) {
        plan.unseated.push(nameToDrop);
      }
      // remove the student from seats if they were dropped into unseated
      plan.seats = plan.seats.map((s) => (s === nameToDrop ? null : s));
      return;
    }
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
          class="grid-item {seat ? 'occupied' : ''}"
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
  <ul
    class="unseated"
    ondrop={(e) => handleDrop(e, -1)}
    ondragover={(e) => e.preventDefault()}
  >
    {#each plan.unseated as student}
      <li
        class="unseated-item"
        draggable="true"
        ondragstart={(e) => handleDragStart(e, student)}
      >
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

  .unseated {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    min-width: 200px;
    min-height: 100px;
    background-color: #eee;
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    max-width: 200px;
  }

  .unseated-item {
    border-radius: 8px;
    height: fit-content;
    padding: 8px;
    margin: 4px;
    background-color: #fff;
    border: 1px solid #ccc;
    cursor: grab;
    user-select: none;
  }
</style>
