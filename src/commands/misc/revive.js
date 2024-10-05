module.exports = {
    name: 'revive',
    description: '🪦 Ping the DeadChat role',

    callback: async (client, interaction) => {
         await interaction.deferReply();
         interaction.deleteReply()
      
         interaction.channel.send('<@&1290777859748794484> wake up!');
    },
};