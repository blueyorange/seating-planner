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
  :global(:root) {
    /* Colors (pared down) */
    --color-primary: #007bff;
    --color-primary-hover: #0056b3;
    --color-secondary: #6c757d;
    --color-secondary-hover: #5a6268;
    --color-white: #ffffff;
    --color-gray-100: #f8f9fa;
    --color-gray-200: #e9ecef;
    --color-gray-300: #dee2e6;
    --color-gray-800: #343a40;
    --color-gray-900: #212529;

    /* Typography */
    --font-family: Arial, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-2xl: 1.5rem;

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Border radius */
    --border-radius-md: 0.375rem;
    --border-radius-lg: 0.5rem;

    /* Shadows */
    --shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

    /* Transitions */
    --transition-base: 0.2s ease;

    /* Font Sizes */
    --font-size-xs: 0.625rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.5rem;
    --font-size-2xl: 2rem;
  }

  :global(body) {
    font-family: var(--font-family);
    margin: 0;
    padding: var(--spacing-xl);
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
  }

  :global(button) {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    font-family: var(--font-family);
    cursor: pointer;
    transition: all var(--transition-base);
    font-weight: 500;
  }

  :global(button:hover) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  :global(button:active) {
    transform: translateY(0);
  }

  :global(.btn-primary) {
    background-color: var(--color-primary);
    color: var(--color-white);
  }

  :global(.btn-primary:hover) {
    background-color: var(--color-primary-hover);
  }

  :global(.btn-secondary) {
    background-color: var(--color-secondary);
    color: var(--color-white);
  }

  :global(.btn-secondary:hover) {
    background-color: var(--color-secondary-hover);
  }

  /* Only primary and secondary button variants for now */

  header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  header h1 {
    color: var(--color-gray-800);
    font-size: var(--font-size-2xl);
    margin: 0;
  }
</style>
