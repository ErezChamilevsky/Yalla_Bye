const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update score
router.post('/scores', async (req, res) => {
    const { name, city, score } = req.body;
    if (!name || !city || score === undefined) {
        return res.status(400).json({ error: 'Missing name, city, or score' });
    }

    try {
        let user = await User.findOne({ name, city });
        if (!user) {
            user = new User({ name, city, bestScore: score });
        } else if (score > user.bestScore) {
            user.bestScore = score;
        }
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Individual leaderboard
router.get('/leaderboard/individual', async (req, res) => {
    try {
        const topPlayers = await User.find().sort({ bestScore: -1 }).limit(10);
        res.json(topPlayers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// City leaderboard (Average best scores per city)
router.get('/leaderboard/city', async (req, res) => {
    try {
        const cityStats = await User.aggregate([
            { $group: { _id: '$city', avgScore: { $avg: '$bestScore' }, totalPlayers: { $sum: 1 } } },
            { $sort: { avgScore: -1 } },
            { $limit: 10 }
        ]);
        res.json(cityStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
