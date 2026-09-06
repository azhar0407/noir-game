/* Pong — Noir */
const Pong = (() => {
  let canvas, ctx, loop;
  const W=400, H=280, PADDLE=50, SPEED=4, WIN=7;
  let player, cpu, ball, gameOver, lastTime;

  function init(stage) {
    stage.innerHTML = `<button class="close" aria-label="Tutup">×</button>
      <div class="panel">
        <h3>Pong</h3>
        <canvas id="pong-canvas" width="${W}" height="${H}" style="background:#000;border:1px solid #26262d;border-radius:8px"></canvas>
        <p id="pong-score" style="font-size:18px">0 — 0</p>
        <p style="color:#8a8a90;font-size:13px">Mouse atau ↑↓ · Skor ${WIN} menang</p>
      </div>`;
    stage.querySelector('.close').addEventListener('click', ()=>stop(stage));
    canvas = document.getElementById('pong-canvas');
    ctx = canvas.getContext('2d');
    player={y:H/2-PADDLE/2,score:0};
    cpu={y:H/2-PADDLE/2,score:0};
    ball={x:W/2,y:H/2,dx:SPEED*(Math.random()>.5?1:-1),dy:(Math.random()-.5)*SPEED};
    gameOver=false; lastTime=0;
    canvas.addEventListener('mousemove', e=>{
      const r=canvas.getBoundingClientRect();
      player.y=Math.max(0,Math.min(H-PADDLE, e.clientY-r.top-PADDLE/2));
    });
    document.addEventListener('keydown', e=>{
      if(e.key==='ArrowUp') player.y=Math.max(0,player.y-8);
      if(e.key==='ArrowDown') player.y=Math.min(H-PADDLE,player.y+8);
    });
    loop = requestAnimationFrame(tick);
  }

  function tick(ts) {
    if (gameOver) return;
    const dt = ts - lastTime; lastTime = ts;
    update(dt);
    draw();
    loop = requestAnimationFrame(tick);
  }

  function update(dt) {
    // CPU AI
    const target = ball.y - PADDLE/2;
    if (cpu.y < target) cpu.y = Math.min(H-PADDLE, cpu.y + SPEED*.7);
    else cpu.y = Math.max(0, cpu.y - SPEED*.7);

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom bounce
    if (ball.y<=0||ball.y>=H) ball.dy *= -1;

    // Player paddle
    if (ball.x<=16 && ball.y>=player.y && ball.y<=player.y+PADDLE) {
      ball.dx=Math.abs(ball.dx);
      ball.dy += (ball.y-(player.y+PADDLE/2))/PADDLE*SPEED;
    }
    // CPU paddle
    if (ball.x>=W-24 && ball.y>=cpu.y && ball.y<=cpu.y+PADDLE) {
      ball.dx=-Math.abs(ball.dx);
      ball.dy += (ball.y-(cpu.y+PADDLE/2))/PADDLE*SPEED;
    }

    // Score
    if (ball.x<0) { cpu.score++; resetBall(-1); }
    if (ball.x>W) { player.score++; resetBall(1); }

    const s = document.getElementById('pong-score');
    if (s) s.textContent=`${player.score} — ${cpu.score}`;

    if (player.score>=WIN) endGame('Kamu menang!');
    else if (cpu.score>=WIN) endGame('CPU menang!');
  }

  function resetBall(dir) {
    ball={x:W/2,y:H/2,dx:SPEED*dir,dy:(Math.random()-.5)*SPEED};
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    // Dashed center
    ctx.strokeStyle='#26262d'; ctx.lineWidth=2; ctx.setLineDash([6,6]);
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
    ctx.setLineDash([]);
    // Paddles
    ctx.fillStyle='#fff';
    ctx.fillRect(8, player.y, 8, PADDLE);
    ctx.fillRect(W-16, cpu.y, 8, PADDLE);
    // Ball
    ctx.beginPath(); ctx.arc(ball.x,ball.y,5,0,Math.PI*2); ctx.fill();
  }

  function endGame(msg) {
    gameOver=true;
    cancelAnimationFrame(loop);
    ctx.fillStyle='rgba(0,0,0,.7)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff'; ctx.font='bold 20px monospace'; ctx.textAlign='center';
    ctx.fillText(msg, W/2, H/2);
  }

  function stop(stage) {
    cancelAnimationFrame(loop);
    stage.classList.add('hidden');
  }

  return { init };
})();
