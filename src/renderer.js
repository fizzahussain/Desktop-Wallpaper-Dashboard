function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function renderTasks() {
  const container = document.getElementById('tasks-list');
  const tasks = window.dashboardTasks.loadTasks();
  container.innerHTML = '';
  if (!tasks.length) {
    container.innerHTML = '<div class="empty-state">Add your first task for today.</div>';
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = `task-row${task.completed ? ' completed' : ''}`;
    row.innerHTML = `
      <button class="task-check" aria-label="Toggle task">${task.completed ? '✓' : ''}</button>
      <input class="task-text" aria-label="Task" />
      <button class="task-delete" aria-label="Delete task">×</button>
    `;
    const text = row.querySelector('.task-text');
    text.value = task.text;
    text.addEventListener('input', () => window.dashboardTasks.updateTask(task.id, { text: text.value }));
    row.querySelector('.task-check').addEventListener('click', () => {
      window.dashboardTasks.updateTask(task.id, { completed: !task.completed });
      renderTasks();
    });
    row.querySelector('.task-delete').addEventListener('click', () => {
      window.dashboardTasks.deleteTask(task.id);
      renderTasks();
    });
    container.appendChild(row);
  });
}

function renderNotes() {
  const container = document.getElementById('notes-list');
  const notes = window.dashboardNotes.loadNotes();
  container.innerHTML = '';
  if (!notes.length) {
    container.innerHTML = '<div class="empty-state">Write down anything you don\'t want to forget.</div>';
    return;
  }
  notes.forEach((note) => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `<input class="note-title" aria-label="Note title" /><textarea class="note-body" aria-label="Note body" placeholder="Write something..."></textarea><button class="note-delete" aria-label="Delete note">×</button>`;
    const title = card.querySelector('.note-title');
    const body = card.querySelector('.note-body');
    title.value = note.title;
    body.value = note.body;
    const persist = () => {
      const updated = window.dashboardNotes.loadNotes().map((item) => item.id === note.id ? { ...item, title: title.value, body: body.value } : item);
      window.dashboardNotes.saveNotes(updated);
    };
    title.addEventListener('input', persist);
    body.addEventListener('input', persist);
    card.querySelector('.note-delete').addEventListener('click', () => { window.dashboardNotes.deleteNote(note.id); renderNotes(); });
    container.appendChild(card);
  });
}

document.querySelector('.tasks .icon-button').addEventListener('click', () => {
  window.dashboardTasks.addTask();
  renderTasks();
  document.querySelector('.task-text:last-of-type')?.focus();
});

document.getElementById('add-note').addEventListener('click', () => {
  window.dashboardNotes.createNote();
  renderNotes();
  document.querySelector('.note-title:last-of-type')?.focus();
});

updateClock();
setInterval(updateClock, 1000);
renderTasks();
renderNotes();
