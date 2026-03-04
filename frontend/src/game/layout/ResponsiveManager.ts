import { Application, Sprite, Point } from 'pixi.js';

export class ResponsiveManager {
    private static gameWidth: number;
    private static gameHeight: number;
    private static bgScale: number;

    // Relative positions for a 3x3 grid
    // Adjusted to be slightly lower and staggered based on typical backgrounds
    private static gridMap = [
        { x: 0.25, y: 0.45 }, { x: 0.5, y: 0.45 }, { x: 0.75, y: 0.45 },
        { x: 0.2, y: 0.65 }, { x: 0.5, y: 0.65 }, { x: 0.8, y: 0.65 },
        { x: 0.25, y: 0.85 }, { x: 0.5, y: 0.85 }, { x: 0.75, y: 0.85 }
    ];

    static resize(app: Application, background: Sprite) {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;

        app.renderer.resize(this.gameWidth, this.gameHeight);

        if (background) {
            this.bgScale = Math.max(this.gameWidth / background.texture.width, this.gameHeight / background.texture.height);
            background.scale.set(this.bgScale);
            background.x = this.gameWidth / 2;
            background.y = this.gameHeight / 2;
            background.anchor.set(0.5);
        }
    }

    static getGridPosition(index: number): Point {
        const pos = this.gridMap[index] || { x: 0.5, y: 0.5 };
        return new Point(this.gameWidth * pos.x, this.gameHeight * pos.y);
    }

    static getScaleFactor(): number {
        return this.bgScale || 1;
    }
}
