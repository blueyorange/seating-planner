class Plan {
  #seated = $state([]);
  #unseated = $state([]);
  name = $state("");
  rows = $state(3);
  cols = $state(6);

  constructor(name, rows, cols) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.#seated = Array(rows * cols).fill(null);
    this.#unseated = [];
  }

  get seated() {
    return this.#seated;
  }

  get unseated() {
    return this.#unseated;
  }

  moveToUnseated(index) {
    this.#unseated.push(this.#seated[index]);
    this.#seated[index] = null;
  }

  addNames(...names) {
    // TODO validate arguments
    this.#unseated = [...this.#unseated, ...names];
  }

  moveNameToIndex(index, name) {
    // remove name from previous position
    const previousIndex = this.#seated.indexOf(name);
    if (previousIndex === -1) {
      // name was from unseated so remove it from unseated
      this.#unseated = this.#unseated.filter((s) => s !== name);
    } else {
      this.#seated[previousIndex] = null;
    }

    if (this.#seated[index] !== null) {
      // if occupied, move to unseated
      this.#unseated.push(this.#seated[index]);
    }
    this.#seated[index] = name;
    this.#unseated = this.#unseated.filter((s) => s !== name);
  }

  empty() {
    this.#unseated = [
      ...this.#unseated,
      ...this.#seated.filter((s) => s !== null),
    ];
    this.#seated = Array(this.rows * this.cols).fill(null);
  }

  fill() {
    for (let i = 0; i < this.#seated.length; i++) {
      if (this.#seated[i] === null && this.#unseated.length > 0) {
        this.#seated[i] = this.#unseated.shift();
      }
    }
  }

  shuffle() {
    this.#seated = this.#seated.sort(() => Math.random() - 0.5);
  }
}

export default Plan;
