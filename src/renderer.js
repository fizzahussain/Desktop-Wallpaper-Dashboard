function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function renderTasks() {
  const container = document.getElementById('tasks-list');
  const tasks = window.dashboardTasks.loadTasks();
  container.innerHTML = '';
  if (!tasks.length) { container.innerHTML = '<div class="empty-state">Add your first task for today.</div>'; return; }
  tasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = `task-row${task.completed ? ' completed' : ''}`;
    row.innerHTML = '<button class="task-check" aria-label="Toggle task"></button><input class="task-text" aria-label="Task" /><button class="task-delete" aria-label="Delete task">×</button>';
    const text = row.querySelector('.task-text');
    text.value = task.text;
    row.querySelector('.task-check').textContent = task.completed ? '✓' : '';
    text.addEventListener('input', () => window.dashboardTasks.updateTask(task.id, { text: text.value }));
    row.querySelector('.task-check').addEventListener('click', () => { window.dashboardTasks.updateTask(task.id, { completed: !task.completed }); renderTasks(); });
    row.querySelector('.task-delete').addEventListener('click', () => { window.dashboardTasks.deleteTask(task.id); renderTasks(); });
    container.appendChild(row);
  });
}

function renderNotes() {
  const container = document.getElementById('notes-list');
  const notes = window.dashboardNotes.loadNotes();
  container.innerHTML = '';
  if (!notes.length) { container.innerHTML = '<div class="empty-state">Write down anything you don\'t want to forget.</div>'; return; }
  notes.forEach((note) => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = '<div class="note-grip" title="Drag note">⋮⋮</div><input class="note-title" aria-label="Note title" /><textarea class="note-body" aria-label="Note body" placeholder="Write something..."></textarea><button class="note-delete" aria-label="Delete note">×</button>';
    const title = card.querySelector('.note-title');
    const body = card.querySelector('.note-body');
    title.value = note.title; body.value = note.body;
    const persist = () => window.dashboardNotes.updateNote(note.id, { title: title.value, body: body.value });
    title.addEventListener('input', persist); body.addEventListener('input', persist);
    card.querySelector('.note-delete').addEventListener('click', () => { window.dashboardNotes.deleteNote(note.id); renderNotes(); });
    card.style.setProperty('--note-x', `${Number(note.x) || 0}px`);
    card.style.setProperty('--note-y', `${Number(note.y) || 0}px`);
    makeDraggable(card, note.id);
    container.appendChild(card);
  });
}

function makeDraggable(element, id) {
  const grip = element.querySelector('.note-grip');
  let dragging = false, startX = 0, startY = 0, originX = 0, originY = 0;
  grip.addEventListener('pointerdown', (event) => {
    dragging = true; startX = event.clientX; startY = event.clientY;
    originX = Number.parseFloat(element.style.getPropertyValue('--note-x')) || 0;
    originY = Number.parseFloat(element.style.getPropertyValue('--note-y')) || 0;
    grip.setPointerCapture(event.pointerId); element.classList.add('dragging');
  });
  grip.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    element.style.setProperty('--note-x', `${originX + event.clientX - startX}px`);
    element.style.setProperty('--note-y', `${originY + event.clientY - startY}px`);
  });
  grip.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    dragging = false; element.classList.remove('dragging'); grip.releasePointerCapture(event.pointerId);
    window.dashboardNotes.updateNote(id, { x: Number.parseFloat(element.style.getPropertyValue('--note-x')) || 0, y: Number.parseFloat(element.style.getPropertyValue('--note-y')) || 0 });
  });
}

const wallpaperButton = document.getElementById('wallpaper-button');
const wallpaperPicker = document.getElementById('wallpaper-picker');
wallpaperButton.addEventListener('click', () => wallpaperPicker.click());
wallpaperPicker.addEventListener('change', () => {
  const file = wallpaperPicker.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => window.dashboardSettings.setWallpaper(reader.result));
  reader.readAsDataURL(file);
});

document.getElementById('add-task').addEventListener('click', () => { window.dashboardTasks.addTask(); renderTasks(); });
document.getElementById('add-note').addEventListener('click', () => { window.dashboardNotes.createNote(); renderNotes(); });
updateClock();
setInterval(updateClock, 1000);
renderTasks();
renderNotes();
