import '../style.css';
import { ResponsiveManager } from './layout/ResponsiveManager';

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
    let scoreHud = document.getElementById('score-hud');
    if (!scoreHud) {
      scoreHud = document.createElement('div');
      scoreHud.id = 'score-hud';
      scoreHud.className = 'hud-element';
      document.body.appendChild(scoreHud);
    }
    scoreHud.innerHTML = `${score}`;

    let timeHud = document.getElementById('time-hud');
    if (!timeHud) {
      timeHud = document.createElement('div');
      timeHud.id = 'time-hud';
      timeHud.className = 'hud-element';
      document.body.appendChild(timeHud);
    }
    timeHud.innerHTML = `${time}s`;

    this.repositionHUD();
  }

  repositionHUD() {
    const scoreHud = document.getElementById('score-hud');
    if (scoreHud) {
      const pos = ResponsiveManager.getUIPosition(668.5, 117); // Center of (385, 53 -> 952, 181)
      const size = ResponsiveManager.getUISize(567, 128);
      scoreHud.style.left = `${pos.x}px`;
      scoreHud.style.top = `${pos.y}px`;
      scoreHud.style.width = `${size.width}px`;
      scoreHud.style.height = `${size.height}px`;
      scoreHud.style.fontSize = `${size.height * 0.6}px`;
    }

    const timeHud = document.getElementById('time-hud');
    if (timeHud) {
      const pos = ResponsiveManager.getUIPosition(668.5, 276); // Center of (351, 241 -> 986, 311)
      const size = ResponsiveManager.getUISize(635, 70);
      timeHud.style.left = `${pos.x}px`;
      timeHud.style.top = `${pos.y}px`;
      timeHud.style.width = `${size.width}px`;
      timeHud.style.height = `${size.height}px`;
      timeHud.style.fontSize = `${size.height * 0.8}px`;
    }
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
