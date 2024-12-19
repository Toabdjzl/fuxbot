const { ApplicationCommandOptionType, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

    name: 'prune',
    description: '🧹 See how many members can be pruned from the server',
    options: [
        {
            name: 'days',
            description: 'Number of days of inactivity required to kick',
            type: ApplicationCommandOptionType.Number,
            min_value: 1,
            max_value: 30,
            required: true
        },
        {
            name: 'roles',
            description: 'Also include members with these roles',
            type: ApplicationCommandOptionType.Role,
            required: false
        }
    ],

    callback: (client, interaction) => {
        const days = interaction.options.getNumber('days');
        const roles = interaction.options.getRole('roles')?.id; //Wie bau ich alle roles so um, dass sie in einem array sind und genutzt werden können für pruneRoles?
        const pruneInfo = interaction.guild.members.prune({ dry: true, days: days})

        console.log(pruneInfo);

        //----- Components -----\\
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Confirm');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Cancel');

        const buttonRow = new ActionRowBuilder()
            .addComponents(confirm, cancel);
        //-------------------------\\

        // See how many members will be pruned
        interaction.guild.members.prune({ dry: true, days: days })
        .then(pruned => interaction.reply({ components: [buttonRow], content: `This will prune **${pruned} members** who have not been seen on Discord for **${days} days**!` }))
        .catch(console.error);


        //----- Embeds -----\\
        const info = new EmbedBuilder()
            .setColor(0xFF8533)
            .setDescription(`This will prune **${days} members** (fake call) who have not been seen on Discord for **${days} days**!`)
        //-------------------------\\
    }
}