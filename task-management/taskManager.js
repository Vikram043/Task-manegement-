const fs = require('fs');
const path = require('path');

const TASK_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) return [];
  const data = fs.readFileSync(TASK_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    console.log("⚠️ tasks.json is corrupted.");
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}


function addTask(title, dueDate) {
  if (!title.trim()) return console.log("❌ Title cannot be empty.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return console.log("❌ Invalid date format (YYYY-MM-DD).");
  const tasks = loadTasks();
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  tasks.push({ id, title, dueDate, completed: false });
  saveTasks(tasks);
  console.log(`✅ Task added: ID ${id}`);
}


function updateTask(identifier, newTitle, newDueDate) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == identifier || t.title === identifier);
  if (!task) return console.log("❌ Task not found.");

  if (newTitle) {
    if (!newTitle.trim()) return console.log("❌ Title cannot be empty.");
    task.title = newTitle;
  }
  if (newDueDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDueDate)) return console.log("❌ Invalid date format.");
    task.dueDate = newDueDate;
  }

  saveTasks(tasks);
  console.log(`✏️ Task ID ${task.id} updated.`);
}


function deleteTask(identifier) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id == identifier || t.title === identifier);
  if (index === -1) return console.log("❌ Task not found.");
  const removed = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`🗑️ Task deleted: ${removed[0].title}`);
}


function searchTasks(keyword) {
  const tasks = loadTasks();
  const lower = keyword.toLowerCase();
  const results = tasks.filter(t =>
    t.title.toLowerCase().includes(lower) || t.dueDate.includes(keyword)
  );
  if (results.length === 0) return console.log("🔍 No matching tasks found.");
  results.forEach(task => {
    const status = task.completed ? "✅" : "❌";
    console.log(`[${status}] ${task.id}. ${task.title} - Due: ${task.dueDate}`);
  });
}


function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) return console.log("📭 No tasks found.");
  tasks.forEach(task => {
    const status = task.completed ? "✅" : "❌";
    console.log(`[${status}] ${task.id}. ${task.title} - Due: ${task.dueDate}`);
  });
}


function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == id);
  if (!task) return console.log("❌ Task not found.");
  task.completed = true;
  saveTasks(tasks);
  console.log(`✅ Task ID ${id} marked complete.`);
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  deleteTask,
  updateTask,
  searchTasks,
};
