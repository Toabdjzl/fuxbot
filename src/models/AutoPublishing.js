const { Schema, model } = require('mongoose');

const autoPublishSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    }
});

module.exports = model('AutoPublishing', autoPublishSchema);