(function () {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Africa/Harare',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const time = now.toLocaleTimeString('en-ZW', options);
    clockEl.textContent = time + ' CAT - Bulawayo, ZW';
  }

  updateClock();
  setInterval(updateClock, 1000);
})();