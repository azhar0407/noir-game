/* Memory Match — Noir */
const Memory = (() => {
  const ICONS = ['♠','♥','♦','♣','★','◆','●','▲'];
  let deck=[], flipped=[], lock=false, moves=0, pairs=0;

  function init(stage) {
    deck = [...ICONS,...ICONS].sort(()=>Math.random()-.5);
    flipped=[]; lock=false; moves=0; pairs=0;
    render(stage);
  }

  function render(stage) {
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    Object.assign(grid.style, {
      display:'grid', gridTemplateColumns:'repeat(4,64px)', gap:'8px',
      padding:'16px', background:'#000', borderRadius:'8px'
    });
    deck.forEach((icon, i) => {
      const card = document.createElement('div');
      Object.assign(card.style, {
        width:'64px', height:'64px', background:'#15151a', border:'1px solid #26262d',
        borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'28px', cursor:'pointer', userSelect:'none'
      });
      card.dataset.icon = icon;
      card.textContent = '?';
      card.addEventListener('click', () => flip(card, i, stage));
      grid.appendChild(card);
    });

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<h3>Memory Match</h3><p id="mm-score">Moves: 0 · Pairs: 0/8</p>`;
    panel.appendChild(grid);
    stage.appendChild(panel);
  }

  function flip(card, idx, stage) {
    if (lock || card.dataset.flipped || flipped.length >= 2) return;
    card.textContent = card.dataset.icon;
    card.dataset.flipped = '1';
    flipped.push({card, idx});
    if (flipped.length < 2) return;
    moves++;
    updateScore(stage);
    if (flipped[0].card.dataset.icon === flipped[1].card.dataset.icon) {
      pairs++; flipped=[]; updateScore(stage);
      if (pairs === 8) setTimeout(()=>win(stage), 300);
    } else {
      lock=true;
      setTimeout(()=>{
        flipped.forEach(f=>{ delete f.card.dataset.flipped; f.card.textContent='?'; });
        flipped=[]; lock=false;
      }, 700);
    }
  }

  function updateScore(stage) {
    const sp = stage.querySelector('#mm-score');
    if (sp) sp.textContent=`Moves: ${moves} · Pairs: ${pairs}/8`;
  }

  function win(stage) {
    const panel = stage.querySelector('.panel');
    const msg = document.createElement('p');
    msg.textContent = `🎉 Selesai dalam ${moves} moves!`;
    msg.style.cssText = 'color:#fff;font-size:18px;font-weight:bold;padding:8px 0';
    panel.appendChild(msg);
    setTimeout(()=>restart(stage), 2000);
  }

  function restart(stage) {
    stage.innerHTML='<button class="close" aria-label="Tutup" style="position:absolute;top:20px;right:20px;background:none;border:none;color:#e8e8ea;font-size:32px;cursor:pointer">×</button>';
    stage.querySelector('.close').addEventListener('click', ()=>stage.classList.add('hidden'));
    init(stage);
  }

  return { init };
})();
