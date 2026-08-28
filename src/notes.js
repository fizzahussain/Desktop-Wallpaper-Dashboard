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
  notes.push({ id: crypto.randomUUID(), title, body, createdAt: Date.now() });
  saveNotes(notes);
  return notes;
}

function deleteNote(id) {
  saveNotes(loadNotes().filter((note) => note.id !== id));
}

window.dashboardNotes = { loadNotes, saveNotes, createNote, deleteNote };
