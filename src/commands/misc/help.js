module.exports = {
    name: 'help',
    description: '🆘 Show help information for Fuxbot',

    callback: (client, interaction) => {
        const embedHelp = new EmbedBuilder()
            .setColor(0xFF8533)
            .setTitle('🆘 Help')
            .setDescription('Type `/` to get started.')

        const buttonHelp = new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/UxUC6qT6d8');

        const rowHelp = new ActionRowBuilder()
            .addComponents(buttonHelp);
        
        interaction.reply({ embeds: [embedHelp], components: [rowHelp], ephemeral: true });
    },
};