import { readFileSync, writeFileSync } from "node:fs";

const readDatabase = () => {
  const json = readFileSync("./db.json", { encoding: "utf-8" });
  const todos = JSON.parse(json);

  return todos;
};
const writeDatabase = (todos) => {
  const json = JSON.stringify(todos);

  writeFileSync("./db.json", json, { encoding: "utf-8" });

  return todos.length - 1;
};
const printTodo = (todo, index) => console.log(`[${index}] ${todo}`);
const commands = {
  add: (description) => {
    const newTodo = description.trim();

    if (!newTodo) {
      console.error("Error: missing description");
      process.exit(1);
    }

    const todos = readDatabase();
    const newTodos = [...todos, newTodo];
    const newTodoIndex = writeDatabase(newTodos);

    printTodo(newTodo, newTodoIndex);
  },
  delete: (rawIndex) => {
    const indexToBeDeleted = Number.parseInt(rawIndex, 10);
    const todos = readDatabase();

    if (
      (!indexToBeDeleted && indexToBeDeleted !== 0) ||
      !todos[indexToBeDeleted]
    ) {
      console.error("Error: invalid index");
      process.exit(1);
    }

    const newTodos = todos.filter((_, index) => index !== indexToBeDeleted);

    writeDatabase(newTodos);
  },
  list: () => {
    const todos = readDatabase();

    todos.forEach(printTodo);
  },
};

// run
const [commandName, ...args] = process.argv.slice(2);
const command = commands[commandName];

if (!command) {
  console.error(`Error: no such command "${commandName}"`);
  process.exit(1);
}

command(...args);
