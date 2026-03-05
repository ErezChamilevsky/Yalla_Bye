import { Application, Sprite, Point } from 'pixi.js';

export class ResponsiveManager {
    private static gameWidth: number;
    private static gameHeight: number;
    private static bgScale: number;
    private static bgOffset: Point = new Point(0, 0);

    // Background dimensions (from asset check)
    private static readonly BG_WIDTH = 1327;
    private static readonly BG_HEIGHT = 1536;

    // Calibrated from user screen (778x887 game area relative to 1327x1536 background)
    private static readonly SCALE_X = 1327 / 778;
    private static readonly SCALE_Y = 1536 / 887;

    private static readonly HOLE_START_X = 175 * ResponsiveManager.SCALE_X;
    private static readonly ROW_Y = [
        333 * ResponsiveManager.SCALE_Y,
        506 * ResponsiveManager.SCALE_Y,
        677 * ResponsiveManager.SCALE_Y
    ];
    private static readonly HOLE_WIDTH = (234 - 175) * ResponsiveManager.SCALE_X;
    public static readonly HOLE_HEIGHT = 260; // For pop-up animation
    private static readonly HOLE_GAP_X = (352 - 175) * ResponsiveManager.SCALE_X - ResponsiveManager.HOLE_WIDTH;

    static resize(app: Application, background: Sprite) {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;

        app.renderer.resize(this.gameWidth, this.gameHeight);

        if (background) {
            // Determine if we should use "Cover" (mobile) or "Contain" (desktop)
            const isMobile = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;

            if (isMobile) {
                // "Cover" scaling for mobile - fill the entire screen
                this.bgScale = Math.max(this.gameWidth / this.BG_WIDTH, this.gameHeight / this.BG_HEIGHT);
            } else {
                // "Contain" scaling for desktop - show full image without cropping
                this.bgScale = Math.min(this.gameWidth / this.BG_WIDTH, this.gameHeight / this.BG_HEIGHT);
            }

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

        const distanceBetweenHoles = this.HOLE_WIDTH + this.HOLE_GAP_X;
        const localX = this.HOLE_START_X + col * distanceBetweenHoles + (this.HOLE_WIDTH / 2);

        // Exact Y row start for alignment
        const localY = this.ROW_Y[row] || 1000;

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
