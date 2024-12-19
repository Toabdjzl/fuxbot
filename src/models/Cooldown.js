const { Schema, model } = require('mongoose');

const cooldownSchema = new Schema({
    commandName: {
        type: String,
        required: true,
    },
    commandOption: {
        type: String,
    },
    userId: {
        type: String,
        required: false,
    },
    guildId: {
        type: String,
        required: false,
    },
    endsAt: {
        type: Date,
        required: true,
    }
});

module.exports = model('Cooldown', cooldownSchema);