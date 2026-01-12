const { MessageFlags } = require('discord.js');
const Cooldown = require('../../models/Cooldown');

module.exports = {
    name: 'revive',
    description: '🪦 Ping the Dead Chat role to boost short-time activity',

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

			// Fuxdev: 1296071593075675148; Fuxtown: 782653335119200278
            const requiredRole = ['1296071593075675148'];

            let cooldown = await Cooldown.findOne({ guildId: interaction.guild.id, commandName: interaction.commandName });

            const embedMissingRole = {
                description: `You need to be <@&1296071593075675148> to run this command.`,
                color: 0xff0000,
            }

            if (!requiredRole.some(roleId => interaction.member.roles.cache.has(roleId))) {
                interaction.editReply({ embeds: [embedMissingRole] });
                return;
            } else {
                if (cooldown && Date.now() < cooldown.endsAt) {
                    const { default: prettyMs } = await import('pretty-ms');
    
                    const embedCooldown = {
                        description: `Server is on cooldown, come back after ${prettyMs(cooldown.endsAt - Date.now())}`,
                        color: 0xff0000,
                    }

                    await interaction.editReply({ embeds: [embedCooldown],
                        // content: `Server is on cooldown, come back after ${prettyMs(cooldown.endsAt - Date.now())}`,
                    });
                    return;
                }
    
                if (!cooldown) {
                    cooldown = new Cooldown({ guildId: interaction.guild.id, commandName: interaction.commandName });
                }
    
                cooldown.endsAt = Date.now() + 14400_000;
    
                await Promise.all([cooldown.save()]);

                interaction.deleteReply();
                interaction.channel.send('<@&1290777859748794484> wake up!');
            }
        } catch (error) {
            console.log(`⚠️  ${error}`)
        }
    },
};