const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
    
    name: 'timeout',
    description: '🧹 Timeout a member in the server',
    // deleted: Boolean,
    options: [
        {
            name: 'user',
            description: 'The user to timeout',
            required: true,
            type: ApplicationCommandOptionType.User,
        },

        {
            name: 'duration',
            description: 'Timeout duration (30m, 1h, 1 day).',
            required: true,
            type: ApplicationCommandOptionType.String,
        },

        {
            name: 'reason',
            description: 'Reason of the timeout',
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value ||'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.user.bot) {
            await interaction.editReply("I can't timeout a bot.");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply('Please provide a valid timeout duration.');
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't timeout that user because they have the same/higher role than you.");
            return;
        }
      
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't timeout that user because they have the same/higher role than me.");
            return;
        }

        //Timeout the user
        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);
        } catch (error) {
            console.log(`⚠️ There was an error when timing out: ${error}.`);
        }
    },
};