/* Snake — Noir */
const SnakeGame = (() => {
  let canvas, ctx, loop;
  const CELL=16, COLS=20, ROWS=20;
  let snake, dir, nextDir, food, score, running;

  function init(stage) {
    stage.innerHTML = `<button class="close" aria-label="Tutup">×</button>
      <div class="panel">
        <h3>Snake</h3>
        <canvas id="snake-canvas" width="${CELL*COLS}" height="${CELL*ROWS}" style="background:#000;border:1px solid #26262d;border-radius:8px"></canvas>
        <p id="snake-score">Score: 0</p>
        <p style="color:#8a8a90;font-size:13px">Arrow keys atau WASD · Space = pause</p>
      </div>`;
    stage.querySelector('.close').addEventListener('click', ()=>stop(stage));
    canvas = document.getElementById('snake-canvas');
    ctx = canvas.getContext('2d');
    snake = [{x:10,y:10}]; dir={x:1,y:0}; nextDir={x:1,y:0};
    score=0; running=true; placeFood();
    document.addEventListener('keydown', onKey);
    loop = setInterval(tick, 120);
  }

  function placeFood() {
    do { food={x:Math.random()*COLS|0, y:Math.random()*ROWS|0}; }
    while (snake.some(s=>s.x===food.x&&s.y===food.y));
  }

  function tick() {
    if (!running) return;
    dir=nextDir;
    const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    // Wall wrap
    if (head.x<0) head.x=COLS-1; if (head.x>=COLS) head.x=0;
    if (head.y<0) head.y=ROWS-1; if (head.y>=ROWS) head.y=0;
    // Self collision
    if (snake.some(s=>s.x===head.x&&s.y===head.y)) { gameover(); return; }
    snake.unshift(head);
    if (head.x===food.x&&head.y===food.y) { score+=10; placeFood(); }
    else snake.pop();
    draw();
    document.getElementById('snake-score').textContent=`Score: ${score}`;
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Grid dots
    ctx.fillStyle='#1a1a1a';
    for(let x=0;x<COLS;x++) for(let y=0;y<ROWS;y++) {
      ctx.fillRect(x*CELL+1,y*CELL+1,2,2);
    }
    // Snake
    ctx.fillStyle='#fff';
    snake.forEach((s,i)=>{ ctx.globalAlpha=1-i/snake.length*.6; ctx.fillRect(s.x*CELL+1,s.y*CELL+1,CELL-2,CELL-2); });
    ctx.globalAlpha=1;
    // Food
    ctx.fillStyle='#ff4444';
    ctx.fillRect(food.x*CELL+2,food.y*CELL+2,CELL-4,CELL-4);
  }

  function onKey(e) {
    const k = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
                w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
    if (k[e.key] && !(k[e.key].x+dir.x===0&&k[e.key].y+dir.y===0)) nextDir=k[e.key];
    if (e.key===' ') { running=!running; }
  }

  function gameover() {
    clearInterval(loop);
    ctx.fillStyle='rgba(0,0,0,.7)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff'; ctx.font='bold 20px monospace'; ctx.textAlign='center';
    ctx.fillText(`GAME OVER — ${score} pts`, canvas.width/2, canvas.height/2);
    ctx.font='14px monospace'; ctx.fillStyle='#8a8a90';
    ctx.fillText('tutup & buka ulang untuk main lagi', canvas.width/2, canvas.height/2+24);
  }

  function stop(stage) {
    clearInterval(loop);
    document.removeEventListener('keydown', onKey);
    stage.classList.add('hidden');
  }

  return { init };
})();
