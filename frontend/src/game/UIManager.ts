import '../style.css';

export class UIManager {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'ui-overlay';
    document.body.appendChild(this.overlay);
  }

  showStartScreen(onStart: (name: string, city: string) => void) {
    this.overlay.innerHTML = `
      <div class="card">
        <h1>Whac-A-Mole</h1>
        <input id="name" type="text" placeholder="Name" />
        <input id="city" type="text" placeholder="City" />
        <button id="start-btn">Start Game</button>
      </div>
    `;
    document.getElementById('start-btn')?.addEventListener('click', () => {
      const name = (document.getElementById('name') as HTMLInputElement).value;
      const city = (document.getElementById('city') as HTMLInputElement).value;
      if (name && city) onStart(name, city);
    });
  }

  updateHUD(score: number, time: number) {
    let hud = document.getElementById('hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'hud';
      document.body.appendChild(hud);
    }
    hud.innerHTML = `Score: ${score} | Time: ${time}s`;
  }

  showGameOver(score: number, leaders: any[], cityLeaders: any[]) {
    this.overlay.innerHTML = `
      <div class="card">
        <h1>Game Over</h1>
        <p style="font-size: 1.5rem; margin-bottom: 2rem;">Your Score: ${score}</p>
        
        <div style="display: flex; gap: 2rem; justify-content: center; text-align: left; margin-bottom: 2rem;">
          <div>
            <h3>Top Players</h3>
            <ul style="list-style: none; padding: 0;">
                ${leaders.slice(0, 5).map(l => `<li>${l.name}: <strong>${l.bestScore}</strong></li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Top Cities</h3>
            <ul style="list-style: none; padding: 0;">
                ${cityLeaders.slice(0, 5).map(c => `<li>${c._id}: <strong>${Math.round(c.avgScore)}</strong></li>`).join('')}
            </ul>
          </div>
        </div>
        
        <button onclick="window.location.reload()">Play Again</button>
      </div>
    `;
  }
}
