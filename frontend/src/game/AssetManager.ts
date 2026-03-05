import { Assets, Texture } from 'pixi.js';

export class AssetManager {
    private static textures: Record<string, Texture> = {};

    static async load() {
        const assets = [
            { alias: 'background', src: '/assets/background.png' },
            { alias: 'kham', src: '/assets/kham.png' },
            { alias: 'kham-dam', src: '/assets/kham-dam.png' },
            { alias: 'sin', src: '/assets/sin.png' },
            { alias: 'sin-dam', src: '/assets/sin-dam.png' },
            { alias: 'nas', src: '/assets/nas.png' },
            { alias: 'nas-dam', src: '/assets/nas-dam.png' },
            { alias: 'slipper', src: '/assets/slipper.png' },
        ];

        // Load all assets in parallel
        const loadedAssets = await Assets.load(assets.map(a => ({ alias: a.alias, src: a.src })));

        // Populate the textures record
        for (const alias in loadedAssets) {
            this.textures[alias] = loadedAssets[alias];
        }
    }

    static getTexture(alias: string): Texture {
        return this.textures[alias];
    }
}
