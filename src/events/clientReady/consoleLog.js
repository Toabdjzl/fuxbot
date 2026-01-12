const { ActivityType } = require('discord.js');

module.exports = (client) => {
    console.log(`🦊 ${client.user.username} is ready!`);

    client.user.setActivity({name: 'Beep. Boop.', type: ActivityType.Custom})
};
