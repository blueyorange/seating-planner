<script>
  import { onMount } from "svelte";
  const rows = 3;
  const cols = 6;
  let plans = $state([]);
  let currentPlanName = $state(null);
  let plan = $derived.by(() => {
    if (!plans || plans.length === 0) return null;
    if (currentPlanName) {
      console.log("Finding plan with name:", currentPlanName);
      return plans.find((p) => p.name === currentPlanName) ?? plans[0];
    }
    return plans[0];
  });
  let editingIndex = $state(-1);
  let editingValue = $state("");
  let editInputEl = $state(null);
  let creatingPlan = $state(false);
  let newPlanName = $state("");
  let createInputEl = $state(null);
  let createDialogEl = $state(null);

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

  // retrieve stored plans and current plan once on mount (avoid reactive loops)
  onMount(() => {
    const storedPlans = localStorage.getItem("plans");
    if (storedPlans) {
      console.log("Stored plans found:", storedPlans);
      const parsedPlans = JSON.parse(storedPlans);
      plans = parsedPlans;
      initialPlans = parsedPlans;
    } else {
      plans = initialPlans;
      console.log("No stored plans found, using initial plans:", initialPlans);
    }

    const storedPlanNameRaw = localStorage.getItem("currentPlanName");
    if (storedPlanNameRaw) {
      try {
        currentPlanName = JSON.parse(storedPlanNameRaw);
      } catch (e) {
        currentPlanName = storedPlanNameRaw;
      }
    } else {
      currentPlanName = plans.length > 0 ? plans[0].name : null;
    }
  });

  $effect(() => {
    if (plan && plan.name) {
      localStorage.setItem("currentPlanName", plan.name);
    }
  });

  $effect(() => {
    if (editingIndex !== -1 && editInputEl) {
      editInputEl.focus();
      editInputEl.select?.();
    }
  });

  $effect(() => {
    if (creatingPlan && createInputEl) {
      createInputEl.focus();
      createInputEl.select?.();
    }
  });

  $effect(() => {
    if (!createDialogEl) return;
    if (creatingPlan) {
      if (!createDialogEl.open) {
        try {
          createDialogEl.showModal();
        } catch (e) {
          /* ignore if already open */
        }
      }
    } else {
      if (createDialogEl.open) {
        createDialogEl.close();
      }
    }
  });

  // Debug effect to track plan changes
  $effect(() => {
    console.log(
      "Plan changed:",
      plan?.name,
      "Current plan name:",
      currentPlanName
    );
  });

  function createEmptyPlan() {
    return {
      name: "New Plan",
      seated: Array(rows * cols).fill(null),
      unseated: [],
    };
  }

  $effect(() => {
    if (plans.length === 0) {
      plans.push({
        name: "Default Plan",
        seated: Array(rows * cols).fill(null),
        unseated: [],
      });
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

  function handleEmpty() {
    plan.unseated = [
      ...plan.unseated,
      ...plan.seated.filter((s) => s !== null),
    ];
    plan.seated = Array(rows * cols).fill(null);
  }
  function handleFill() {
    for (let i = 0; i < plan.seated.length; i++) {
      if (plan.seated[i] === null && plan.unseated.length > 0) {
        plan.seated[i] = plan.unseated.shift(); // Fill empty seats with unseated students
      }
    }
  }

  function handleReset() {
    localStorage.removeItem("plans");
    localStorage.removeItem("currentPlanName");
    window.location.reload();
  }

  function handleShuffle() {
    plan.seated = plan.seated.sort(() => Math.random() - 0.5);
  }

  function handleDeletePlan() {
    if (!plan) return;
    const planNameToDelete = plan.name;
    const confirmed = window.confirm(
      `Are you sure you want to delete plan "${planNameToDelete}"? This cannot be undone.`
    );
    if (!confirmed) return;

    // Remove the plan
    plans = plans.filter((p) => p.name !== planNameToDelete);

    // Reset editing state if any
    editingIndex = -1;
    editingValue = "";

    // Choose a new current plan if any remain
    if (plans.length > 0) {
      currentPlanName = plans[0].name;
    } else {
      currentPlanName = null;
    }
  }

  function openCreateDialog() {
    newPlanName = "";
    creatingPlan = true;
  }

  function getUniquePlanName(baseName) {
    const existingNames = new Set(plans.map((p) => p.name));
    if (!existingNames.has(baseName)) return baseName;
    let counter = 2;
    while (existingNames.has(`${baseName} (${counter})`)) {
      counter += 1;
    }
    return `${baseName} (${counter})`;
  }

  function handleCreateConfirm() {
    const trimmed = newPlanName.trim();
    if (!trimmed) {
      // Keep dialog open; focus input again
      if (createInputEl) createInputEl.focus();
      return;
    }
    const uniqueName = getUniquePlanName(trimmed);
    const newPlan = {
      name: uniqueName,
      seated: Array(rows * cols).fill(null),
      unseated: [],
    };
    plans.push(newPlan);
    currentPlanName = uniqueName;
    creatingPlan = false;
    newPlanName = "";
    createInputEl = null;
    createDialogEl?.close();
  }

  function handleCreateCancel() {
    creatingPlan = false;
    newPlanName = "";
    createInputEl = null;
    createDialogEl?.close();
  }

  function handleCreateKeydown(event) {
    if (event.key === "Enter") {
      handleCreateConfirm();
    } else if (event.key === "Escape") {
      handleCreateCancel();
    }
  }

  function handleCreateSubmit(event) {
    event.preventDefault();
    handleCreateConfirm();
  }

  function handleDoubleClick(index) {
    editingIndex = index;
    editingValue = plan.seated[index] || "";
  }

  function handleEditSave() {
    if (editingIndex >= 0) {
      const trimmedValue = editingValue.trim();
      if (trimmedValue) {
        // If there was already a student in this seat, remove them from unseated
        const oldStudent = plan.seated[editingIndex];
        if (oldStudent) {
          plan.unseated = plan.unseated.filter((s) => s !== oldStudent);
        }
        // Add the new student to the seat
        plan.seated[editingIndex] = trimmedValue;
        // Remove the new student from unseated if they were there
        plan.unseated = plan.unseated.filter((s) => s !== trimmedValue);
      } else {
        // If empty value, move existing student to unseated
        const oldStudent = plan.seated[editingIndex];
        if (oldStudent && !plan.unseated.includes(oldStudent)) {
          plan.unseated.push(oldStudent);
        }
        plan.seated[editingIndex] = null;
      }
    }
    editingIndex = -1;
    editingValue = "";
    editInputEl = null;
  }

  function handleEditCancel() {
    editingIndex = -1;
    editingValue = "";
    editInputEl = null;
  }

  function handleEditKeydown(event) {
    if (event.key === "Enter") {
      handleEditSave();
    } else if (event.key === "Escape") {
      handleEditCancel();
    }
  }
</script>

<header class="app-header">
  <div class="header-inner">
    <h1 class="header-title">Seating Planner</h1>
    <div class="header-actions">
      <select bind:value={currentPlanName} class="select small">
        {#each plans as p}
          <option value={p.name}>{p.name}</option>
        {/each}
      </select>
      <button class="primary" onclick={openCreateDialog}>New</button>
      <button class="danger" onclick={handleDeletePlan}>Delete</button>
    </div>
  </div>
</header>

<main>
  <div class="container">
    <menu>
      <button class="empty" onclick={handleEmpty}>Empty</button>
      <button class="fill" onclick={handleFill}>Fill</button>
      <button class="shuffle" onclick={handleShuffle}>Shuffle</button>
      <button class="reset" onclick={handleReset}>Reset</button>
    </menu>
    {#if plan}
      <div
        class="grid"
        style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 60px); gap: 8px;"
        role="listbox"
      >
        {#each plan.seated as seat, i}
          <div
            draggable={editingIndex !== i}
            ondragstart={(e) => handleDragStart(e, seat)}
            class="grid-item {seat ? 'occupied' : ''}"
            ondrop={(e) => handleDrop(e, i)}
            ondragover={(e) => e.preventDefault()}
            ondblclick={() => handleDoubleClick(i)}
            role="option"
            aria-selected={seat ? "true" : "false"}
            tabindex="0"
          >
            {#if editingIndex === i}
              <input
                type="text"
                bind:value={editingValue}
                onblur={handleEditSave}
                onkeydown={handleEditKeydown}
                class="edit-input"
                bind:this={editInputEl}
              />
            {:else}
              {seat}
            {/if}
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

  <dialog class="modal" bind:this={createDialogEl} onclose={handleCreateCancel}>
    <form method="dialog" onsubmit={handleCreateSubmit} class="modal-form">
      <h2>Create New Plan</h2>
      <label for="plan-name">Plan name</label>
      <input
        id="plan-name"
        type="text"
        placeholder="e.g. S3 or Period 2"
        bind:value={newPlanName}
        onkeydown={handleCreateKeydown}
        bind:this={createInputEl}
      />
      <div class="modal-actions">
        <button value="cancel" onclick={handleCreateCancel}>Cancel</button>
        <button class="confirm" value="default">Create</button>
      </div>
    </form>
  </dialog>
</main>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
    margin: 0;
    background-color: #f4f4f4;
  }
  header.app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin: 0;
  }

  .header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .header-title {
    font-size: 20px;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 20px;
  }

  menu {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .select {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 120px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
  }

  .select.small {
    padding: 8px 14px;
    min-width: 100px;
    background-position: right 10px center;
    background-size: 14px;
    padding-right: 32px;
  }

  .select:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .select:focus {
    outline: none;
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .select:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button:nth-child(2) {
    background-color: #ef4444;
    color: white;
  }

  button:nth-child(2):hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  }

  button:nth-child(3) {
    background-color: #10b981;
    color: white;
  }

  button:nth-child(3):hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }

  button:nth-child(4) {
    background-color: #f59e0b;
    color: white;
  }

  button:nth-child(4):hover {
    background-color: #d97706;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  }

  button:nth-child(5) {
    background-color: #6b7280;
    color: white;
  }

  button:nth-child(5):hover {
    background-color: #4b5563;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
  }

  button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Danger button style for destructive actions */
  .danger {
    background-color: #b91c1c;
    color: white;
  }

  .danger:hover {
    background-color: #991b1b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(185, 28, 28, 0.3);
  }

  /* Primary button style for actions like create */
  .primary {
    background-color: #3b82f6;
    color: white;
  }

  .primary:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .confirm {
    background-color: #10b981;
    color: white;
  }

  .confirm:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  }

  /* Modal styles using native dialog */
  dialog.modal::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }

  dialog.modal {
    border: none;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    width: calc(100% - 32px);
    max-width: 420px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .modal h2 {
    margin: 0 0 12px;
  }

  .modal label {
    display: block;
    font-size: 14px;
    color: #374151;
    margin-bottom: 6px;
  }

  .modal input[type="text"] {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
  }

  .modal input[type="text"]:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .edit-input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: inherit;
    font-family: inherit;
    text-align: center;
    outline: none;
    padding: 0;
    margin: 0;
    color: inherit;
  }

  .edit-input:focus {
    background-color: rgba(59, 130, 246, 0.1);
    border-radius: 4px;
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
