import { Application, Sprite, Point } from 'pixi.js';

export class ResponsiveManager {
    private static gameWidth: number;
    private static gameHeight: number;
    private static bgScale: number;
    private static bgOffset: Point = new Point(0, 0);

    // Background dimensions (from asset check)
    private static readonly BG_WIDTH = 1327;
    private static readonly BG_HEIGHT = 1536;

    // Grid details from user
    private static readonly HOLE_START_X = 235;
    private static readonly HOLE_START_Y = 402;
    private static readonly HOLE_WIDTH = 240;
    private static readonly HOLE_HEIGHT = 498;
    private static readonly HOLE_GAP_X = 65;
    private static readonly HOLE_GAP_Y = 100;

    static resize(app: Application, background: Sprite) {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;

        app.renderer.resize(this.gameWidth, this.gameHeight);

        if (background) {
            // "Contain" scaling - show full image
            this.bgScale = Math.min(this.gameWidth / this.BG_WIDTH, this.gameHeight / this.BG_HEIGHT);
            background.scale.set(this.bgScale);

            // Center the background
            background.x = this.gameWidth / 2;
            background.y = this.gameHeight / 2;
            background.anchor.set(0.5);

            // Calculate offset of background top-left corner on screen
            this.bgOffset.x = (this.gameWidth - this.BG_WIDTH * this.bgScale) / 2;
            this.bgOffset.y = (this.gameHeight - this.BG_HEIGHT * this.bgScale) / 2;
        }
    }

    static getGridPosition(index: number): Point {
        const row = Math.floor(index / 3);
        const col = index % 3;

        // X: Start + (hole + gap) * col + half_hole
        // Applying -5px offset as requested (in local background coords)
        const localX = this.HOLE_START_X + col * (this.HOLE_WIDTH + this.HOLE_GAP_X) + (this.HOLE_WIDTH / 2) - 5;
        // Y: Start + (hole + gap) * row + full_hole (anchor bottom)
        const localY = this.HOLE_START_Y + row * (this.HOLE_HEIGHT + this.HOLE_GAP_Y) + this.HOLE_HEIGHT - 5;

        return new Point(
            this.bgOffset.x + localX * this.bgScale,
            this.bgOffset.y + localY * this.bgScale
        );
    }

    static getMoleScale(originalWidth: number): number {
        // Scale mole to fit hole width
        const targetWidth = this.HOLE_WIDTH;
        const scaleInHole = targetWidth / originalWidth;
        return (this.bgScale || 1) * scaleInHole;
    }

    static getScaleFactor(): number {
        return this.bgScale || 1;
    }

    // Helper to get UI positions (like score/time areas)
    static getUIPosition(localX: number, localY: number): Point {
        return new Point(
            this.bgOffset.x + localX * this.bgScale,
            this.bgOffset.y + localY * this.bgScale
        );
    }

    static getUISize(localWidth: number, localHeight: number) {
        return {
            width: localWidth * this.bgScale,
            height: localHeight * this.bgScale
        };
    }
}
