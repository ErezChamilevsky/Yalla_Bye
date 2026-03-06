import '../style.css';
import { ResponsiveManager } from './layout/ResponsiveManager';
import { SoundManager } from '../services/SoundManager';

export class UIManager {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'ui-overlay';
    document.body.appendChild(this.overlay);

    const linkedin = document.createElement('a');
    linkedin.href = 'https://www.linkedin.com/in/erez-chamilevsky/';
    linkedin.target = '_blank';
    linkedin.className = 'linkedin-link-footer';
    linkedin.innerHTML = `<img src="/assets/linkedin.png" alt="LinkedIn">`;
    document.body.appendChild(linkedin);

    const muteBtn = document.createElement('button');
    muteBtn.id = 'mute-btn';
    muteBtn.innerHTML = SoundManager.isMuted ? '🔇' : '🔊';
    muteBtn.addEventListener('click', () => {
      const isMuted = SoundManager.toggleMute();
      muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
    });
    document.body.appendChild(muteBtn);
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

    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      const isMobile = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      if (isMobile) {
        muteBtn.style.left = '20px';
      } else {
        // Position relative to the background left edge on desktop
        const bgPos = ResponsiveManager.getUIPosition(50, 0); // Position at background local X=50
        muteBtn.style.left = `${bgPos.x}px`;
      }
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
    const productionUrl = 'https://yallabye.vercel.app';
    const shareLink = `${productionUrl}/share/${randomImg}/${score}`;
    const shareText = `I scored ${score} slaps in Yalla Bye! Can you pass me?\nPlay now: ${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    this.overlay.innerHTML = `
      <div class="card">
        <h1>Game Over</h1>
        <img src="/assets/${randomImg}.png" class="result-img" alt="Result Character">
        <p class="score-text">Slaps: ${score}</p>
        <div class="btn-container">
          <button id="play-again-btn">Play Again</button>
          <button id="share-btn" class="whatsapp-btn">
            Share
          </button>
        </div>
      </div>
    `;

    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      this.hideOverlay();
      onPlayAgain();
    });

    document.getElementById('share-btn')?.addEventListener('click', () => {
      window.open(whatsappUrl, '_blank');
    });
  }
}

