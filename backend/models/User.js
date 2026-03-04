const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    bestScore: { type: Number, default: 0 }
}, { timestamps: true });

// Index for leaderboards
userSchema.index({ bestScore: -1 });
userSchema.index({ city: 1, bestScore: -1 });

module.exports = mongoose.model('User', userSchema);
