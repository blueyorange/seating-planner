<script>
  import { onMount } from "svelte";
  const rows = 3;
  const cols = 6;

  let initialPlans = [
    {
      name: "S1",
      seated: Array(rows * cols).fill(null),
      unseated: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"],
    },
    {
      name: "S2",
      seated: Array(rows * cols).fill(null),
      unseated: ["Grace", "Heidi", "Ivan", "Judy", "Karl", "Leo"],
    },
  ];

  let plans = $state(initialPlans);
  let plan = $state(null);

  function normalizePlans(list) {
    if (!Array.isArray(list)) return initialPlans;
    for (const p of list) {
      if (!("seated" in p) && "seats" in p) {
        p.seated = Array.isArray(p.seats)
          ? p.seats
          : Array(rows * cols).fill(null);
        delete p.seats;
      }
      if (!Array.isArray(p.seated)) {
        p.seated = Array(rows * cols).fill(null);
      }
      if (p.seated.length !== rows * cols) {
        const next = Array(rows * cols).fill(null);
        for (let i = 0; i < Math.min(p.seated.length, next.length); i++)
          next[i] = p.seated[i];
        p.seated = next;
      }
      if (!Array.isArray(p.unseated)) p.unseated = [];
    }
    return list;
  }

  // retrieve stored plans and current plan once on mount (avoid reactive loops)
  onMount(() => {
    const storedPlans = localStorage.getItem("plans");
    if (storedPlans) {
      try {
        plans = normalizePlans(JSON.parse(storedPlans));
      } catch {}
    }

    const currentPlanNameRaw = localStorage.getItem("currentPlanName");
    if (currentPlanNameRaw) {
      let name;
      try {
        name = JSON.parse(currentPlanNameRaw);
      } catch {
        name = currentPlanNameRaw;
      }
      const match = plans.find((p) => p.name === name);
      if (match) plan = match;
    }
  });

  $effect(() => {
    if (plan) {
      localStorage.setItem("currentPlanName", JSON.stringify(plan.name));
    }
  });

  $effect(() => {
    if (plans.length === 0) {
      plans.push({
        name: "Default Plan",
        seated: Array(rows * cols).fill(null),
        unseated: [],
      });
    }
  });

  $effect(() => {
    if (plans.length > 0 && !plan) {
      plan = plans[0];
    }
  });

  // save state to local storage
  $effect(() => {
    localStorage.setItem("plans", JSON.stringify(plans));
  });

  function handleDrop(event, index) {
    event.preventDefault();
    if (index < 0) {
      // If index is -1, drop into unseated list
      const nameToDrop = event.dataTransfer.getData("text/plain");
      if (!plan.unseated.includes(nameToDrop)) {
        plan.unseated.push(nameToDrop);
      }
      // remove the student from seated if they were dropped into unseated
      plan.seated = plan.seated.map((s) => (s === nameToDrop ? null : s));
      return;
    }
    if (plan.seated[index]) {
      // If the seat is already occupied, move the student to the unseated list
      const occupiedStudent = plan.seated[index];
      plan.unseated.push(occupiedStudent);
    }
    const nameToDrop = event.dataTransfer.getData("text/plain");
    plan.seated = plan.seated.map((s) => (s === nameToDrop ? null : s)); // set students with that name to null in seats
    plan.seated[index] = nameToDrop; // place the student in the dropped seat
    plan.unseated = plan.unseated.filter((s) => s !== nameToDrop); // remove the student from unseated
  }

  function handleDragStart(event, student) {
    event.dataTransfer.setData("text/plain", student);
  }

  function handleClear() {
    plan.unseated = [
      ...plan.unseated,
      ...plan.seated.filter((s) => s !== null),
    ];
    plan.seated = Array(rows * cols).fill(null);
  }
  function handleFill() {}
</script>

<header>
  <h1>Seating Planner</h1>
</header>

<main>
  <div class="container">
    <menu>
      <select bind:value={plan} class="select">
        {#each plans as p}
          <option value={p}>{p.name}</option>
        {/each}
      </select>
      <button onclick={handleClear}>Clear</button>
    </menu>
    {#if plan}
      <div
        class="grid"
        style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 60px); gap: 8px;"
        role="listbox"
      >
        {#each plan.seated as seat, i}
          <div
            draggable="true"
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
    {/if}
  </div>
  {#if plan}
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
  {/if}
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
    cursor: default;
    user-select: none;
  }

  .occupied {
    cursor: grab;
    background-color: #d4f7d4;
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
