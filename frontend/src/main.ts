import { Application, Sprite, Container } from 'pixi.js';
import { AssetManager } from './game/AssetManager';
import { GameEngine } from './game/GameEngine';
import { ResponsiveManager } from './game/layout/ResponsiveManager';
import { Slipper } from './game/components/Slipper';
import { UIManager } from './game/UIManager';
import { APIService } from './services/APIService';

async function init() {
    const ui = new UIManager();
    const app = new Application();
    await app.init({
        background: '#1099bb',
        resizeTo: window,
    });
    document.body.appendChild(app.canvas);

    await AssetManager.load();

    const background = new Sprite(AssetManager.getTexture('background'));
    app.stage.addChild(background);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    const engine = new GameEngine(app, gameContainer);
    const slipper = new Slipper();
    app.stage.addChild(slipper);

    let currentUser = { name: '', city: '' };

    engine.setCallbacks(
        (score, time) => ui.updateHUD(score, time),
        async (score) => {
            await APIService.submitScore(currentUser.name, currentUser.city, score);
            const [leaders, cityLeaders] = await Promise.all([
                APIService.getIndividualLeaderboard(),
                APIService.getCityLeaderboard()
            ]);
            ui.showGameOver(score, leaders, cityLeaders);
        }
    );

    ui.showStartScreen((name, city) => {
        currentUser = { name, city };
        engine.start();
        const overlay = document.getElementById('ui-overlay');
        if (overlay) overlay.innerHTML = '';
    });

    // Resize listener
    window.addEventListener('resize', () => {
        ResponsiveManager.resize(app, background);
        engine.updateMolePositions();
    });
    ResponsiveManager.resize(app, background);
    engine.updateMolePositions();

    // Interaction
    app.stage.eventMode = 'static';
    app.stage.on('pointermove', (e) => {
        slipper.updatePosition(e.global);
    });

    app.stage.on('pointerdown', (e) => {
        slipper.whack();
        engine.handleWhack(e.global);
    });
}

init();
