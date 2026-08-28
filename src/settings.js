const WALLPAPER_KEY = 'desktop-dashboard-wallpaper';

function getWallpaper() {
  return localStorage.getItem(WALLPAPER_KEY) || '';
}

function setWallpaper(dataUrl) {
  localStorage.setItem(WALLPAPER_KEY, dataUrl);
  document.body.style.setProperty('--wallpaper', `url("${dataUrl}")`);
}

function clearWallpaper() {
  localStorage.removeItem(WALLPAPER_KEY);
  document.body.style.removeProperty('--wallpaper');
}

function restoreWallpaper() {
  const wallpaper = getWallpaper();
  if (wallpaper) document.body.style.setProperty('--wallpaper', `url("${wallpaper}")`);
}

window.dashboardSettings = { getWallpaper, setWallpaper, clearWallpaper, restoreWallpaper };
restoreWallpaper();
