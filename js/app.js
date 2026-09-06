// ── Dev Override (dari dev panel) ────────────────────────────────
const DEV = JSON.parse(localStorage.getItem('noir-dev-inject') || '{}');
const RTP_OVERRIDE  = DEV.rtp  ? DEV.rtp  / 100 : 0.96; // default 96%
const VOL_MODE      = DEV.vol  || 'normal';
const NEAR_MISS_ON  = DEV.nearMiss !== false;
const LDW_ON        = DEV.ldw  !== false;
const NM_DIST       = DEV.nmdist || 2;

const GAMES=[
 {id:'black-gold',title:'Black Gold',category:'classic',mark:'7',tone:'linear-gradient(145deg,#351d08,#0c0c0c)',symbols:['7','◆','♛','●','BAR'],pay:{'7':8,'◆':5,'♛':4,'●':3,'BAR':2}},
 {id:'moon-vault',title:'Moon Vault',category:'adventure',mark:'☾',tone:'linear-gradient(145deg,#122541,#08090c)',symbols:['☾','★','◆','♜','A'],pay:{'☾':8,'★':5,'◆':4,'♜':3,'A':2}},
 {id:'jade-dragon',title:'Jade Dragon',category:'mythic',mark:'龍',tone:'linear-gradient(145deg,#093629,#080b09)',symbols:['龍','◆','☯','●','K'],pay:{'龍':8,'◆':5,'☯':4,'●':3,'K':2}},
 {id:'scarlet-seven',title:'Scarlet Seven',category:'classic',mark:'7',tone:'linear-gradient(145deg,#481314,#0c0808)',symbols:['7','♥','★','BAR','Q'],pay:{'7':8,'♥':5,'★':4,'BAR':3,'Q':2}},
 {id:'polar-riches',title:'Polar Riches',category:'adventure',mark:'❄',tone:'linear-gradient(145deg,#123b48,#070a0c)',symbols:['❄','◆','♛','●','J'],pay:{'❄':8,'◆':5,'♛':4,'●':3,'J':2}},
 {id:'olympus-noir',title:'Olympus Noir',category:'mythic',mark:'⚡',tone:'linear-gradient(145deg,#3d310d,#090909)',symbols:['⚡','♛','★','◆','10'],pay:{'⚡':8,'♛':5,'★':4,'◆':3,'10':2}}
];
const $=s=>document.querySelector(s),grid=$('#game-grid'),modal=$('#game-modal'),reels=$('#reels');
let balance=Number(localStorage.getItem('noir-demo-balance'))||10000,current=null,spinning=false;
let history=JSON.parse(localStorage.getItem('noir-demo-history')||'[]');
const fmt=n=>new Intl.NumberFormat('id-ID').format(n);
function save(){localStorage.setItem('noir-demo-balance',balance);localStorage.setItem('noir-demo-history',JSON.stringify(history.slice(0,30)));$('#balance').textContent=fmt(balance)}
function render(filter='all',query=''){grid.innerHTML='';const list=GAMES.filter(g=>(filter==='all'||g.category===filter)&&g.title.toLowerCase().includes(query.toLowerCase()));$('#empty').hidden=!!list.length;list.forEach(g=>{const card=document.createElement('article');card.className='game-card';card.dataset.mark=g.mark;card.style.setProperty('--tone',g.tone);card.innerHTML=`<small>${g.category.toUpperCase()}</small><h3>${g.title}</h3><p>5 reels · RTP demo 96%</p><button class="play" aria-label="Mainkan ${g.title}">▶</button>`;card.onclick=()=>openGame(g);grid.appendChild(card)})}
function openGame(game){current=game;$('#game-title').textContent=game.title;$('#game-message').textContent='3 simbol pertama sama = menang';$('#win-display').textContent='MENANG 0';reels.innerHTML='';for(let i=0;i<5;i++){const r=document.createElement('div');r.className='reel';r.textContent=game.symbols[i%game.symbols.length];reels.appendChild(r)}modal.hidden=false;document.body.style.overflow='hidden'}
function closeGame(){if(spinning)return;modal.hidden=true;document.body.style.overflow='';current=null}
function randomSymbol(){const a=current.symbols;return a[crypto.getRandomValues(new Uint32Array(1))[0]%a.length]}

// Engine hasil: sesuaikan dengan RTP + volatility + near-miss
function engineResult(bet){
  const allSymbols=current.symbols;
  const winSyms=['7','◆','★','♛','♥','☾','龍','⚡','❄'];
  const tierW = VOL_MODE==='cold' ? {3:.06,4:.18,5:.55} :
                VOL_MODE==='hot'  ? {3:.40,4:.45,5:.15} :
                                    {3:.22,4:.40,5:.38};
  let pick=0,acc=0,p=Math.random();
  for(const t of [3,4,5]){acc+=tierW[t];if(p<=acc){pick=t;break;}}
  if(pick===0){
    return {reels:Array.from({length:5},()=>allSymbols[Math.random()*allSymbols.length|0]),win:0,mult:0,ldw:false,count:0};
  }
  const sym=winSyms[Math.random()*winSyms.length|0];
  const reels=Array(5).fill(sym);
  const blanks=5-pick; for(let i=0;i<blanks;i++)reels[Math.random()*5|0]=allSymbols[Math.random()*allSymbols.length|0];
  if(NEAR_MISS_ON&&VOL_MODE==='cold'&&pick===3&&Math.random()<.5){
    const altMap={'7':'★','◆':'★','★':'7','♥':'7','♛':'◆','☾':'◆','龍':'◆','⚡':'★','❄':'◆'};
    const cur=reels[4];
    if(altMap[sym]&&cur===sym){reels[4]=altMap[sym];}
  }
  for(let i=reels.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[reels[i],reels[j]]=[reels[j],reels[i]];}
  const mult=pick===3?5:pick===4?20:80;
  const win=bet*mult;
  const ldw=LDW_ON&&win>0&&win<bet;
  return {reels,win,mult,ldw,count:pick};
}
function spin(){
  if(spinning||!current)return;
  const bet=Number($('#bet').value);
  if(balance<bet){$('#game-message').textContent='Kredit demo tidak cukup';return}
  balance-=bet;save();
  spinning=true;$('#spin').disabled=true;
  $('#game-message').textContent='Memutar…';
  document.querySelectorAll('.reel').forEach(r=>r.classList.add('spinning'));
  setTimeout(()=>{
    const r=engineResult(bet);
    document.querySelectorAll('.reel').forEach((el,i)=>{el.classList.remove('spinning');el.textContent=r.reels[i]});
    balance+=r.win;
    history.unshift({game:current.title,bet,win:r.win,result:r.reels.join(' '),time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})});
    $('#win-display').textContent=`MENANG ${fmt(r.win)}`;
    let msg='Belum menang. Coba lagi.';
    if(r.ldw)msg=`Hampir! ${r.count}× cocok. (LDW)`;
    else if(r.win>0)msg=`${r.count}× cocok — menang ${r.mult}×!`;
    $('#game-message').textContent=msg;
    spinning=false;$('#spin').disabled=false;save();
  },750);
}
function renderHistory(){const list=$('#history-list');list.innerHTML=history.length?'':'<p style="color:#858b94">Belum ada putaran.</p>';history.forEach(h=>{const x=document.createElement('div');x.className='history-item';x.innerHTML=`<div><b>${h.game}</b><br><span>${h.result} · bet ${fmt(h.bet)}</span></div><div><span>${h.time}</span><br><strong class="${h.win?'win':''}">${h.win?'+'+fmt(h.win):'0'}</strong></div>`;list.appendChild(x)})}
$('#spin').onclick=spin;$('#close-game').onclick=closeGame;modal.onclick=e=>{if(e.target===modal)closeGame()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGame()});$('#history-button').onclick=()=>{renderHistory();$('#history').hidden=false};$('#close-history').onclick=()=>$('#history').hidden=true;$('#search').oninput=e=>render(document.querySelector('#filters .active').dataset.filter,e.target.value);$('#filters').onclick=e=>{if(!e.target.dataset.filter)return;document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');render(e.target.dataset.filter,$('#search').value)};save();render();
