const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const Cooldown = require('../../models/Cooldown');

module.exports = {
    deleted: false,
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
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        }
    ],

    callback: async (client, interaction) => {
        const input = interaction.options.get('message').value;
        const channel = interaction.options.getChannel('channel');
        try {
            await interaction.deferReply({ ephemeral:true });

            const commandName = 'echo';
            const guildId = interaction.guild.id;

            let cooldown = await Cooldown.findOne({ guildId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const cldwn = Math.round(cooldown.endsAt / 1_000);
                await interaction.editReply({
                    content: `Server is on cooldown, come back <t:${cldwn}:R>.`,
                    ephemeral: true,
                });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ guildId, commandName });
            }

            cooldown.endsAt = Date.now() + 600_000;

            await Promise.all([cooldown.save()]);

            interaction.deleteReply();
            interaction.channel.send(`${input}`);
        } catch (error) {
            console.log(`⚠️  ${error}`);
        }
    },
};
