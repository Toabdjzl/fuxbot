const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
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
        const member = interaction.options.getMember('member') ?? interaction.member;

        await interaction.deferReply();
        

        const embed = {
            description: `🖼️ ${member}`,
            image: { url: `${member.displayAvatarURL({ dynamic: true, size: 2048 })}` },
            color: 0xff8533,
        }

        interaction.editReply({ embeds: [embed] });
    },
};