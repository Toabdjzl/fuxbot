const { ApplicationCommandOptionType, ChannelType, MessageFlags } = require('discord.js');
const Cooldown = require('../../models/Cooldown');

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
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        }
    ],

    callback: async (client, interaction) => {
        const input = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

			// Cooldown check
            let cooldown = await Cooldown.findOne({ guildId: interaction.guild.id, commandName: interaction.commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const cldwn = Math.round(cooldown.endsAt / 1_000);
                await interaction.editReply({ content: `Server is on cooldown, come back <t:${cldwn}:R>.` });
                return;
            }
            if (!cooldown) {
                cooldown = new Cooldown({ guildId: interaction.guild.id, commandName: interaction.commandName });
            }
            cooldown.endsAt = Date.now() + 600_000;
            await Promise.all([cooldown.save()]);

            await interaction.deleteReply();
            channel.send({ content: `${input}`, allowedMentions: { parse: [] } });
        } catch (error) {
            console.log(`⚠️  ${error}`);
        }
    },
};