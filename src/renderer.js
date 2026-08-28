function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('date').textContent = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

updateClock();
setInterval(updateClock, 1000);
