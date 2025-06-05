const readline = require('readline');
const {
  addTask, listTasks, deleteTask,
  completeTask, updateTask, searchTasks
} = require('./taskManager');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  while (true) {
    console.log(`\nCommands: add | list | complete | delete-task | update-task | search-tasks | help | quit`);
    const cmd = (await ask("Enter command: ")).trim().toLowerCase();

    if (cmd === "add") {
      const title = await ask("Enter title: ");
      const due = await ask("Enter due date (YYYY-MM-DD): ");
      addTask(title, due);

    } else if (cmd === "list") {
      listTasks();

    } else if (cmd === "complete") {
      const id = await ask("Enter task ID: ");
      completeTask(parseInt(id));

    } else if (cmd === "delete-task") {
      const idOrTitle = await ask("Enter task ID or title: ");
      deleteTask(idOrTitle);

    } else if (cmd === "update-task") {
      const idOrTitle = await ask("Enter task ID or title: ");
      const newTitle = await ask("Enter new title (or leave empty): ");
      const newDue = await ask("Enter new due date (YYYY-MM-DD or leave empty): ");
      updateTask(idOrTitle, newTitle.trim() || null, newDue.trim() || null);

    } else if (cmd === "search-tasks") {
      const keyword = await ask("Enter title keyword or due date: ");
      searchTasks(keyword.trim());

    } else if (cmd === "help") {
      console.log(`
🔧 Available Commands:
- add           : Add a new task
- list          : List all tasks
- complete      : Mark task as completed
- delete-task   : Delete a task by ID or title
- update-task   : Update task title or due date
- search-tasks  : Search tasks by title or due date
- help          : Show this help message
- quit          : Exit the application
      `);

    } else if (cmd === "quit") {
      console.log("👋 Goodbye!");
      rl.close();
      break;

    } else {
      console.log("❌ Unknown command. Type 'help' to see all commands.");
    }
  }
}

main();
