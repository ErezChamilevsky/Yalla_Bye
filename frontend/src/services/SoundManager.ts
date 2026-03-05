export class SoundManager {
    private static backgroundAudio: HTMLAudioElement | null = null;

    static playWhack() {
        const audio = new Audio('/assets/whack.mp3');
        audio.play().catch(e => console.error('Error playing whack sound:', e));
    }

    static playRandomOuch() {
        const ouchSounds = [
            '/assets/ouch1.mp3',
            '/assets/ouch2.mp3',
            '/assets/ouch3.mp3'
        ];
        const randomSound = ouchSounds[Math.floor(Math.random() * ouchSounds.length)];
        const audio = new Audio(randomSound);
        audio.play().catch(e => console.error('Error playing ouch sound:', e));
    }

    static playBackgroundMusic() {
        if (!this.backgroundAudio) {
            this.backgroundAudio = new Audio('/assets/Whack_A_Circuit.mp3');
            this.backgroundAudio.loop = true;
            this.backgroundAudio.volume = 0.3; // Significantly reduced to let SFX be heard
        }
        this.backgroundAudio.currentTime = 0;
        this.backgroundAudio.play().catch(e => console.error('Error playing background music:', e));
    }

    static stopBackgroundMusic() {
        if (this.backgroundAudio) {
            this.backgroundAudio.pause();
            this.backgroundAudio.currentTime = 0;
        }
    }
}
