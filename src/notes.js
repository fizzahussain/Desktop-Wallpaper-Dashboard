const STORAGE_KEY = 'desktop-dashboard-notes';

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNote(title = 'New note', body = '') {
  const notes = loadNotes();
  notes.push({ id: crypto.randomUUID(), title, body, x: 0, y: 0, createdAt: Date.now() });
  saveNotes(notes);
  return notes;
}

function updateNote(id, changes) {
  saveNotes(loadNotes().map((note) => note.id === id ? { ...note, ...changes } : note));
}

function deleteNote(id) {
  saveNotes(loadNotes().filter((note) => note.id !== id));
}

window.dashboardNotes = { loadNotes, saveNotes, createNote, updateNote, deleteNote };
