export class SoundManager {
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
}
