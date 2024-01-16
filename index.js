import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

const readDatabase = async () => {
  const json = await readFile("./db.json", { encoding: "utf-8" });

  return JSON.parse(json);
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

    readDatabase()
      .then((todos) => {
        const newTodos = [...todos, newTodo];

        return writeDatabase(newTodos);
      })
      .then((newTodoIndex) => {
        printTodo(newTodo, newTodoIndex);
      });
  },
  delete: (rawIndex) => {
    const indexToBeDeleted = Number.parseInt(rawIndex, 10);
    readDatabase()
      .then((todos) => {
        if (
          (!indexToBeDeleted && indexToBeDeleted !== 0) ||
          !todos[indexToBeDeleted]
        ) {
          console.error("Error: invalid index");
          process.exit(1);
        }

        const newTodos = todos.filter((_, index) => index !== indexToBeDeleted);

        return newTodos;
      })
      // NOTE: cleaner version .then(writeDatabase);
      .then((todos) => writeDatabase(todos));
  },
  list: async () => {
    const todos = await readDatabase();

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
