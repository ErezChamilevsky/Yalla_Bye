import { Sprite, Container, Point } from 'pixi.js';
import { AssetManager } from '../AssetManager';
import { ResponsiveManager } from '../layout/ResponsiveManager';

export class Slipper extends Container {
    private sprite: Sprite;

    constructor() {
        super();
        this.sprite = new Sprite(AssetManager.getTexture('slipper'));
        this.sprite.anchor.set(0.5);
        this.addChild(this.sprite);

        // Make it follow the pointer
        this.eventMode = 'none';
        this.updateScale();
    }

    updateScale() {
        // Use RespondentManager to keep it proportional to holes
        // Slipper is texture width 546, kham is 587. Similar enough.
        const scale = ResponsiveManager.getMoleScale(this.sprite.texture.width) * 1.8;
        this.sprite.scale.set(scale);
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
