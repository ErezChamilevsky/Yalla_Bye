import '../style.css';
import { ResponsiveManager } from './layout/ResponsiveManager';

export class UIManager {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'ui-overlay';
    document.body.appendChild(this.overlay);
  }

  showStartScreen(onStart: () => void) {
    this.overlay.classList.add('active');
    this.overlay.innerHTML = `
      <div class="card">
        <h1>Yalla Bye</h1>
        <button id="start-btn">Start Game</button>
      </div>
    `;
    document.getElementById('start-btn')?.addEventListener('click', () => {
      onStart();
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
      const pos = ResponsiveManager.getUIPosition(387, 48);
      const size = ResponsiveManager.getUISize(567, 128);
      scoreHud.style.left = `${pos.x}px`;
      scoreHud.style.top = `${pos.y}px`;
      scoreHud.style.width = `${size.width}px`;
      scoreHud.style.height = `${size.height}px`;
      // Removed translateX(-50%) to match the old working version
      scoreHud.style.fontSize = `${size.height * 0.6}px`;
    }

    const timeHud = document.getElementById('time-hud');
    if (timeHud) {
      const pos = ResponsiveManager.getUIPosition(355, 240);
      const size = ResponsiveManager.getUISize(635, 70);
      timeHud.style.left = `${pos.x}px`;
      timeHud.style.top = `${pos.y}px`;
      timeHud.style.width = `${size.width}px`;
      timeHud.style.height = `${size.height}px`;
      // Removed translateX(-50%) to match the old working version
      timeHud.style.fontSize = `${size.height * 0.8}px`;
    }
  }

  hideOverlay() {
    this.overlay.classList.remove('active');
    this.overlay.innerHTML = '';
  }

  showGameOver(score: number, onPlayAgain: () => void) {
    this.overlay.classList.add('active');
    const damImages = ['kham-dam', 'nas-dam', 'sin-dam'];
    const randomImg = damImages[Math.floor(Math.random() * damImages.length)];
    const shareText = `I scored ${score} slapps in Yalla Bye! Can you pass me? https://yalla-bye.vercel.app/`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    this.overlay.innerHTML = `
      <div class="card">
        <h1>Game Over</h1>
        <img src="/assets/${randomImg}.png" class="result-img" alt="Result Character">
        <p class="score-text">Slaps: ${score}</p>
        <div class="btn-container">
          <button id="play-again-btn">Play Again</button>
          <button class="whatsapp-btn" onclick="window.open('${whatsappUrl}', '_blank')">
            Share on WhatsApp
          </button>
        </div>
      </div>
    `;

    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      this.hideOverlay();
      onPlayAgain();
    });
  }
}

