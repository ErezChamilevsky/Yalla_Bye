export class APIService {
    private static BASE_URL = 'http://localhost:5000/api';

    static async submitScore(name: string, city: string, score: number) {
        const response = await fetch(`${this.BASE_URL}/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, city, score }),
        });
        return response.json();
    }

    static async getIndividualLeaderboard() {
        const response = await fetch(`${this.BASE_URL}/leaderboard/individual`);
        return response.json();
    }

    static async getCityLeaderboard() {
        const response = await fetch(`${this.BASE_URL}/leaderboard/city`);
        return response.json();
    }
}
