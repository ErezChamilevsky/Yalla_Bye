import { Application, Container, Point } from 'pixi.js';
import { Mole, MoleType } from './components/Mole';
import { ResponsiveManager } from './layout/ResponsiveManager';
import { SoundManager } from '../services/SoundManager';

export class GameEngine {
    private moles: Mole[] = [];
    private score: number = 0;
    private timeLeft: number = 60;
    private timerInterval?: number;
    private spawnTimeout?: number;
    private onUpdate?: (score: number, time: number) => void;
    private onGameOver?: (score: number) => void;

    private activeMoleIndex: number = -1;

    constructor(public app: Application, private container: Container) {
        this.setupMoles();
    }

    setCallbacks(onUpdate: (s: number, t: number) => void, onGameOver: (s: number) => void) {
        this.onUpdate = onUpdate;
        this.onGameOver = onGameOver;
    }

    private setupMoles() {
        const types: MoleType[] = ['kham', 'sin', 'nas'];
        // Create 9 moles, one for each grid position
        for (let i = 0; i < 9; i++) {
            const type = types[i % types.length];
            const mole = new Mole(type);
            this.moles.push(mole);
            this.container.addChild(mole);
        }
        this.updateMolePositions();
    }

    public updateMolePositions() {
        this.moles.forEach((mole, i) => {
            const pos = ResponsiveManager.getGridPosition(i);
            mole.x = pos.x;
            mole.y = pos.y;
            mole.updateScale();
        });
    }

    start() {
        this.score = 0;
        this.timeLeft = 60;
        this.activeMoleIndex = -1;
        this.moles.forEach(m => m.hide());

        this.onUpdate?.(this.score, this.timeLeft);
        SoundManager.playBackgroundMusic();

        this.timerInterval = window.setInterval(() => {
            this.timeLeft--;
            this.onUpdate?.(this.score, this.timeLeft);
            if (this.timeLeft <= 0) this.stop();
        }, 1000);

        this.spawnLoop();
    }

    private spawnLoop() {
        if (this.timeLeft <= 0) return;

        // Ensure only one mole is active
        const currentActive = this.moles.find(m => m.isActive);
        if (!currentActive) {
            this.activeMoleIndex = Math.floor(Math.random() * this.moles.length);
            const mole = this.moles[this.activeMoleIndex];

            // Reposition in case of resize
            const pos = ResponsiveManager.getGridPosition(this.activeMoleIndex);
            mole.x = pos.x;
            mole.y = pos.y;

            mole.show();

            // Auto-hide after some time
            const hideDelay = Math.max(800, 2000 - (60 - this.timeLeft) * 20); // Gets faster
            this.spawnTimeout = window.setTimeout(() => {
                mole.hide();
                this.spawnLoop();
            }, hideDelay);
        } else {
            // Wait a bit and check again
            this.spawnTimeout = window.setTimeout(() => this.spawnLoop(), 100);
        }
    }

    stop() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        this.moles.forEach(m => m.hide());
        SoundManager.stopBackgroundMusic();
        this.onGameOver?.(this.score);
    }

    handleWhack(pos: Point): boolean {
        if (this.activeMoleIndex !== -1) {
            const mole = this.moles[this.activeMoleIndex];
            if (mole.containsPoint(pos.x, pos.y)) {
                mole.hit();
                this.score += 10;
                this.onUpdate?.(this.score, this.timeLeft);

                // Clear the auto-hide timeout and spawn next immediately
                if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
                this.spawnTimeout = window.setTimeout(() => this.spawnLoop(), 300);

                return true;
            }
        }
        return false;
    }
}
