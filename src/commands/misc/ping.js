const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'ping',
	description: '⚡ Check the bots response time',

    callback: async (client, interaction) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

		const embedPing = new EmbedBuilder()
			.setDescription(`🤖 ${ping}ms | 🌐 ${client.ws.ping}ms`)
			.setColor(0xff8533);

        interaction.editReply({ embeds: [embedPing] });
    },
};