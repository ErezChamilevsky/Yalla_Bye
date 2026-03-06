export class SoundManager {
    private static backgroundAudio: HTMLAudioElement | null = null;
    public static isMuted: boolean = false;

    static playWhack() {
        if (this.isMuted) return;
        const audio = new Audio('/assets/whack.mp3');
        audio.play().catch(e => console.error('Error playing whack sound:', e));
    }

    static playCharacterOuch(type: string) {
        if (this.isMuted) return;
        let soundUrl = '/assets/ouch1.mp3'; // Default to kham
        if (type === 'sin') {
            soundUrl = '/assets/ouch2.mp3';
        } else if (type === 'nas') {
            soundUrl = '/assets/ouch3.mp3';
        }
        const audio = new Audio(soundUrl);
        audio.play().catch(e => console.error('Error playing ouch sound:', e));
    }

    static playBackgroundMusic() {
        if (!this.backgroundAudio) {
            this.backgroundAudio = new Audio('/assets/Whack_A_Circuit.mp3');
            this.backgroundAudio.loop = true;
            this.backgroundAudio.volume = 0.3; // Significantly reduced to let SFX be heard
        }
        this.backgroundAudio.currentTime = 0;
        if (!this.isMuted) {
            this.backgroundAudio.play().catch(e => console.error('Error playing background music:', e));
        }
    }

    static stopBackgroundMusic() {
        if (this.backgroundAudio) {
            this.backgroundAudio.pause();
            this.backgroundAudio.currentTime = 0;
        }
    }

    static toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.backgroundAudio) this.backgroundAudio.pause();
        } else {
            // Need to make sure it plays only if the game is active (i.e. backgroundAudio exists)
            // Or just try playing it in general
            if (this.backgroundAudio && this.backgroundAudio.currentTime > 0) {
                this.backgroundAudio.play().catch(e => console.error('Error resuming background music:', e));
            }
        }
        return this.isMuted;
    }
}
