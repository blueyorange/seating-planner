<script>
  import { Plan } from "$lib";
  import SeatingPlan from "../components/SeatingPlan.svelte";

  const rows = 3;
  const cols = 6;

  let plan = new Plan("Test", rows, cols);
  plan.addNames("Alice", "Bob", "Charlie", "David", "Eve", "Frank");
</script>

<header>
  <h1>Seating Planner</h1>
</header>

<SeatingPlan {plan} />

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
</style>
