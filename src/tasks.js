const TASKS_STORAGE_KEY = 'desktop-dashboard-tasks';

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(text = 'New task') {
  const tasks = loadTasks();
  tasks.push({ id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() });
  saveTasks(tasks);
  return tasks;
}

function updateTask(id, changes) {
  saveTasks(loadTasks().map((task) => task.id === id ? { ...task, ...changes } : task));
}

function deleteTask(id) {
  saveTasks(loadTasks().filter((task) => task.id !== id));
}

window.dashboardTasks = { loadTasks, saveTasks, addTask, updateTask, deleteTask };
