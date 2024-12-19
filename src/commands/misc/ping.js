module.exports = {
    name: 'ping',
    description: "⚡ Check the bots response time",
    devOnly: true,

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const embed_ping = {
            description: `🤖 ${ping}ms | 🌐 ${client.ws.ping}ms`,
            color: 0xff8533,
        };

        interaction.editReply({ embeds: [embed_ping] });
    },
};
