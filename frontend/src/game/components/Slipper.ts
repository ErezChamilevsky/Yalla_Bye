import { Sprite, Container, Point } from 'pixi.js';
import { AssetManager } from '../AssetManager';

export class Slipper extends Container {
    private sprite: Sprite;

    constructor() {
        super();
        this.sprite = new Sprite(AssetManager.getTexture('slipper'));
        this.sprite.anchor.set(0.5);
        this.addChild(this.sprite);

        // Make it follow the pointer
        this.eventMode = 'none';
    }

    updatePosition(pos: Point) {
        this.x = pos.x;
        this.y = pos.y;
    }

    whack() {
        // Rotation/Translation animation for whacking
        this.sprite.rotation = -0.5;
        setTimeout(() => {
            this.sprite.rotation = 0;
        }, 100);
    }
}
