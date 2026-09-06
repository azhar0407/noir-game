/* Noir Games — app.js */
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  const stageContent = document.getElementById('stage-content');
  const games = { memory: Memory, snake: SnakeGame, pong: Pong };

  // Play buttons
  document.querySelectorAll('[data-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      const game = btn.closest('[data-game]').dataset.game;
      if (!games[game]) return;
      stageContent.innerHTML = '';
      stage.classList.remove('hidden');
      games[game].init(stageContent);
    });
  });

  // Close buttons
  stage.addEventListener('click', e => {
    if (e.target === stage || e.target.classList.contains('close')) {
      stage.classList.add('hidden');
      stageContent.innerHTML = '';
    }
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      stage.classList.add('hidden');
      stageContent.innerHTML = '';
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });
});
