/* Showcase: link ke demo resmi Pragmatic Play (iframe embed resmi) */
const STUDIOS = [
  {
    name: "Pragmatic Play",
    url: "https://www.pragmaticplay.com/en/games/",
    thumb: "https://picsum.photos/seed/pp/320/180",
    desc: "150+ slot & table games · resmi"
  },
  {
    name: "Play'n GO",
    url: "https://www.playngo.com/games",
    thumb: "https://picsum.photos/seed/png/320/180",
    desc: "Slot, blackjack, roulette · resmi"
  },
  {
    name: "Hacksaw Gaming",
    url: "https://www.hacksawgaming.com/games",
    thumb: "https://picsum.photos/seed/hg/320/180",
    desc: "Slot unik, scratch cards · resmi"
  }
];

const container = document.getElementById('showcase-cards');
if (container) {
  STUDIOS.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'card';
    a.innerHTML = `<h3>${s.name}</h3><p>${s.desc}</p><span class="play" style="font-size:13px">↗ Buka resmi</span>`;
    container.appendChild(a);
  });
}
