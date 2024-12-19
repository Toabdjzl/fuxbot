const { Schema, model } = require('mongoose');

const autoReactSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    emojiId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false,
    }
});

module.exports = model('AutoReaction', autoReactSchema);