import { Container, Sprite, Texture } from 'pixi.js';
import { AssetManager } from '../AssetManager';
import { ResponsiveManager } from '../layout/ResponsiveManager';

import { SoundManager } from '../../services/SoundManager';

export type MoleType = 'kham' | 'sin' | 'nas';

export class Mole extends Container {
    private sprite: Sprite;
    private normalTexture: Texture;
    private damagedTexture: Texture;
    public isHit: boolean = false;
    public isActive: boolean = false;
    public type: MoleType;

    constructor(type: MoleType) {
        super();
        this.type = type;
        this.normalTexture = AssetManager.getTexture(type);
        this.damagedTexture = AssetManager.getTexture(`${type}-dam`);

        this.sprite = new Sprite(this.normalTexture);
        this.sprite.anchor.set(0.5, 1); // Bottom center anchor
        this.addChild(this.sprite);

        this.visible = false;
        this.eventMode = 'none';

        this.updateScale();
    }

    public updateScale() {
        const scale = ResponsiveManager.getMoleScale(this.normalTexture.width);
        // Base size is 1.5x, whacked size is 2x on top of that (1.5 * 2.0 = 3.0)
        const multiplier = this.isHit ? 3.0 : 1.5;
        this.sprite.scale.set(scale * multiplier);
    }

    show(durationInFrames: number = 10) {
        this.isHit = false;
        this.isActive = true;
        this.sprite.texture = this.normalTexture;
        this.updateScale(); // Reset scale to normal
        this.visible = true;
        this.alpha = 0;
        this.eventMode = 'static';

        // Use 1/4 of the character height for pop-up distance
        const distance = this.sprite.height * 0.25;
        this.sprite.y = distance;

        let frames = 0;
        const animate = () => {
            if (!this.isActive || this.isHit) return;
            frames++;
            if (this.alpha < 1) this.alpha += (1 / durationInFrames);
            if (this.sprite.y > 0) this.sprite.y -= (distance / durationInFrames);
            if (frames < durationInFrames) requestAnimationFrame(animate);
            else {
                this.alpha = 1;
                this.sprite.y = 0;
            }
        };
        animate();
    }

    hit() {
        if (this.isHit) return;
        this.isHit = true;
        this.sprite.texture = this.damagedTexture;
        this.updateScale(); // Enlarge immediately upon hit

        SoundManager.playWhack();
        SoundManager.playCharacterOuch(this.type);

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
                setTimeout(() => this.hide(5), 300); // Faster hide after being hit
            }
        };
        shake();
    }

    hide(durationInFrames: number = 10) {
        if (!this.isActive) return;
        this.isActive = false;
        this.eventMode = 'none';

        const distance = this.sprite.height * 0.25;
        let frames = 0;
        const animate = () => {
            frames++;
            this.alpha -= (1 / durationInFrames);
            if (this.sprite.y < distance) this.sprite.y += (distance / durationInFrames);
            if (frames < durationInFrames) {
                requestAnimationFrame(animate);
            } else {
                this.visible = false;
                this.alpha = 0;
                this.sprite.y = 0;
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
