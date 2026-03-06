import { Point } from 'pixi.js';
import { ResponsiveManager } from '../layout/ResponsiveManager';

export class Slipper {
    private element: HTMLImageElement;
    private rotation: number = 0;

    constructor() {
        this.element = document.createElement('img');
        this.element.src = '/assets/slipper.png';
        this.element.id = 'game-slipper';
        this.element.style.position = 'fixed';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '10'; // Above HUD (5) but below Footer (1000)
        this.element.style.transition = 'transform 0.1s ease-out';
        this.element.style.transformOrigin = 'center';
        this.element.style.display = 'none'; // Hide until first move
        document.body.appendChild(this.element);

        this.updateScale();
    }

    updateScale() {
        // Slipper texture width is 546
        const scale = ResponsiveManager.getMoleScale(546) * 1.8;
        // The scale from ResponsiveManager is relative to the canvas. 
        // We need to apply it to the image size.
        const width = 546 * scale;
        this.element.style.width = `${width}px`;
        this.element.style.height = 'auto';
    }

    updatePosition(pos: Point) {
        this.element.style.display = 'block';
        this.element.style.left = `${pos.x}px`;
        this.element.style.top = `${pos.y}px`;
        this.updateTransform();
    }

    private updateTransform() {
        this.element.style.transform = `translate(-50%, -50%) rotate(${this.rotation}rad)`;
    }

    whack() {
        this.rotation = -0.5;
        this.updateTransform();
        setTimeout(() => {
            this.rotation = 0;
            this.updateTransform();
        }, 100);
    }

    destroy() {
        this.element.remove();
    }
}
