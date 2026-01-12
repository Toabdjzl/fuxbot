const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const AfkStatus = require('../../models/AfkStatus');

module.exports = {
	name: 'afk',
	description: '🛌 Set your afk status',
	options: [
		{
			name: 'status',
			description: 'Set your afk status message',
			type: ApplicationCommandOptionType.String,
		}
	],

	callback: async (client, interaction) => {
		const statusMessage = interaction.options.getString('status');
		const afkStatus = await AfkStatus.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });

		if (afkStatus) {
			if (!afkStatus.statusMessage && !statusMessage) {
				await interaction.deferReply();
				return interaction.deleteReply();
			}
			if (afkStatus.statusMessage && !statusMessage) {
				await AfkStatus.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id, statusMessage: statusMessage });
				return interaction.reply({ content: 'I removed your afk message but you are still set as afk.', flags: MessageFlags.Ephemeral });
			}
			else {
				await AfkStatus.updateOne({ guildId: interaction.guild.id, userId: interaction.user.id, statusMessage: statusMessage });
				return interaction.reply({ content: `I changed your afk status message to "${statusMessage}".`, flags: MessageFlags.Ephemeral });
			}
		} else {
			await AfkStatus.create({ guildId: interaction.guild.id, userId: interaction.user.id, statusMessage: statusMessage });
			if (!statusMessage) {
				return interaction.reply({ content: 'You are now afk.', flags: MessageFlags.Ephemeral });
			}
			else {
				return interaction.reply({ content: `You are now afk with reason "${statusMessage}".`, flags: MessageFlags.Ephemeral });
			}
		}
	},
};