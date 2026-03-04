import { Container, Sprite, Texture } from 'pixi.js';
import { AssetManager } from '../AssetManager';
import { ResponsiveManager } from '../layout/ResponsiveManager';

export type MoleType = 'kham' | 'sin' | 'nas';

export class Mole extends Container {
    private sprite: Sprite;
    private normalTexture: Texture;
    private damagedTexture: Texture;
    public isHit: boolean = false;
    public isActive: boolean = false;

    constructor(type: MoleType) {
        super();
        this.normalTexture = AssetManager.getTexture(type);
        this.damagedTexture = AssetManager.getTexture(`${type}-dam`);

        this.sprite = new Sprite(this.normalTexture);
        this.sprite.anchor.set(0.5, 1); // Bottom center anchor
        this.addChild(this.sprite);

        this.visible = false;
        this.eventMode = 'none';

        // Scale mole based on background scale
        const scale = ResponsiveManager.getScaleFactor() * 0.5; // Adjusted size
        this.sprite.scale.set(scale);
    }

    show() {
        this.isHit = false;
        this.isActive = true;
        this.sprite.texture = this.normalTexture;
        this.visible = true;
        this.alpha = 0;
        this.eventMode = 'static';

        // Simple fade in and pop up
        const targetY = 0;
        this.y += 50;

        let frames = 0;
        const animate = () => {
            if (!this.isActive || this.isHit) return;
            frames++;
            if (this.alpha < 1) this.alpha += 0.1;
            if (this.y > targetY) this.y -= 5;
            if (frames < 10) requestAnimationFrame(animate);
        };
        animate();
    }

    hit() {
        if (this.isHit) return;
        this.isHit = true;
        this.sprite.texture = this.damagedTexture;

        // Shake effect
        const originalX = this.sprite.x;
        let shakeFrames = 0;
        const shake = () => {
            if (shakeFrames < 10) {
                this.sprite.x = originalX + (Math.random() - 0.5) * 10;
                shakeFrames++;
                requestAnimationFrame(shake);
            } else {
                this.sprite.x = originalX;
                setTimeout(() => this.hide(), 300);
            }
        };
        shake();
    }

    hide() {
        if (!this.isActive) return;
        this.isActive = false;
        this.eventMode = 'none';

        let frames = 0;
        const animate = () => {
            frames++;
            this.alpha -= 0.1;
            this.y += 5;
            if (frames < 10) {
                requestAnimationFrame(animate);
            } else {
                this.visible = false;
            }
        };
        animate();
    }

    // Improved hit detection using the sprite's actual bounds
    containsPoint(x: number, y: number): boolean {
        if (!this.visible || !this.isActive || this.isHit) return false;
        const b = this.sprite.getBounds();
        // Manually check bounds if contains is missing or flaky
        return x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
    }
}
