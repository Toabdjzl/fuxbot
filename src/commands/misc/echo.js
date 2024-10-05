const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'echo',
    description: '🪃 Replies with your input',
    options: [
        {
            name: 'message',
            description: 'The message to echo back',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'channel',
            description: 'The channel to send the message to',
            type: ApplicationCommandOptionType.Channel, // How do I limit this to just text channels?
        }
    ],

    callback: (client, interaction) => {
        const input = interaction.options.get('message').value;
        // const channel = interaction.options.get('channel')?.value;

        interaction.reply(`${input}`);
    },
};