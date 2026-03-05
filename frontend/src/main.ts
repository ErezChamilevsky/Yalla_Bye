import { Application, Sprite, Container } from 'pixi.js';
import { AssetManager } from './game/AssetManager';
import { GameEngine } from './game/GameEngine';
import { ResponsiveManager } from './game/layout/ResponsiveManager';
import { Slipper } from './game/components/Slipper';
import { UIManager } from './game/UIManager';

async function init() {
    console.log('Initializing game...');

    // Cleanup existing elements if any (for HMR)
    document.querySelectorAll('canvas').forEach(c => c.remove());
    document.getElementById('ui-overlay')?.remove();

    const ui = new UIManager();
    const app = new Application();

    // Start loading assets in parallel with PIXI initialization
    const assetsLoading = AssetManager.load();

    try {
        await app.init({
            background: '#1099bb',
            resizeTo: window,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true,
            hello: true // Useful for debugging PIXI version in console
        });
        document.body.appendChild(app.canvas);

        await assetsLoading; // Wait for assets if not already done
        console.log('PIXI initialized and assets loaded');

        const bgTexture = AssetManager.getTexture('background');
        if (!bgTexture) throw new Error('Background texture failed to load');

        const background = new Sprite(bgTexture);
        app.stage.addChild(background);

        const gameContainer = new Container();
        app.stage.addChild(gameContainer);

        const engine = new GameEngine(app, gameContainer);
        const slipper = new Slipper();
        app.stage.addChild(slipper);

        engine.setCallbacks(
            (score, time) => ui.updateHUD(score, time),
            (score) => {
                ui.showGameOver(score, () => {
                    engine.start();
                });
            }
        );

        // Show start screen initially
        ui.showStartScreen(() => {
            engine.start();
            ui.hideOverlay();
        });


        // Resize listener
        window.addEventListener('resize', () => {
            ResponsiveManager.resize(app, background);
            engine.updateMolePositions();
            slipper.updateScale();
            ui.repositionHUD();
        });
        ResponsiveManager.resize(app, background);
        engine.updateMolePositions();
        slipper.updateScale();
        ui.repositionHUD();

        // Interaction
        app.stage.eventMode = 'static';
        app.stage.on('pointermove', (e) => {
            slipper.updatePosition(e.global);
        });

        app.stage.on('pointerdown', (e) => {
            slipper.whack();
            engine.handleWhack(e.global);
        });

        console.log('Game initialized and ready');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Show an error on screen if possible
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.background = 'red';
        errorDiv.innerHTML = `Error: ${error instanceof Error ? error.message : String(error)}`;
        document.body.appendChild(errorDiv);
    }
}

init();
