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

    private getHideDelay(): number {
        const slaps = Math.floor(this.score / 10);

        if (slaps <= 5) return 2000;       // 0-5 Slaps: Easy
        if (slaps <= 9) return 1500;       // 6-9 Slaps: Harder
        if (slaps <= 13) return 1200;      // 10-13 Slaps: Challenging
        if (slaps <= 17) return 1000;      // 14-17 Slaps: even harder

        // 18+ Slaps: Continues to speed up every 3 slaps
        const extraGroups = Math.floor((slaps - 18) / 3);
        const reduction = extraGroups * 50;
        return Math.max(425, 1000 - reduction); // Min 425ms
    }

    private getAnimationDuration(): number {
        const slaps = Math.floor(this.score / 10);
        if (slaps <= 5) return 10;
        if (slaps <= 9) return 8;
        if (slaps <= 13) return 7;
        if (slaps <= 17) return 6;
        return 5;
    }

    private getSpawnDelay(): number {
        const slaps = Math.floor(this.score / 10);
        if (slaps <= 5) return 300;
        if (slaps <= 9) return 250;
        if (slaps <= 13) return 200;
        return 150;
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

            const animSpeed = this.getAnimationDuration();
            mole.show(animSpeed);

            // Auto-hide after some time (based on difficulty)
            const hideDelay = this.getHideDelay();
            this.spawnTimeout = window.setTimeout(() => {
                mole.hide(animSpeed);
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
        this.moles.forEach(m => m.hide(5));
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
                const spawnDelay = this.getSpawnDelay();
                this.spawnTimeout = window.setTimeout(() => this.spawnLoop(), spawnDelay);

                return true;
            }
        }
        return false;
    }
}
