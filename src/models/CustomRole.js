const { Schema, model } = require('mongoose');

const customRoleSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    roleColour: {
        type: String,
        required: true,
    },
    roleIcon: {
        type: String,
    }
});

module.exports = model('CustomRole', customRoleSchema);