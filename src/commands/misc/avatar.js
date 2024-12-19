const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    deleted: false,
    name: 'avatar',
    description: '📷 Take a look at someones avatar',
    testOnly: true,
    options: [
        {
            name: 'member',
            description: 'Choose a user',
            type: ApplicationCommandOptionType.User
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const member = interaction.options.getMember('member') ?? interaction.member;
        const requestUserRole = interaction.member.roles.cache;
        const requiredRole = ['1296071593075675148'];

        // Embeds \\
        const embedSuccess = {
            description: `🖼️ ${member}`,
            image: { url: `${member.displayAvatarURL({ dynamic: true, size: 2048 })}` },
            color: 0xff8533,
        }
        const embedMissingRole = {
            description: `You need to be <@&1296071593075675148> to run this command.`,
            color: 0xff0000,
        }

        // if (!interaction.member.roles.cache.has('1296071593075675148')) {
        if (!requiredRole.some(roleId => interaction.member.roles.cache.has(roleId))) {
            interaction.editReply({ embeds: [embedMissingRole] });
            return;
        } else {
            interaction.editReply({ embeds: [embedSuccess] });
        }

        
    },
};
