const Cooldown = require('../../models/Cooldown');

module.exports = {
    deleted: false,
    name: 'revive',
    description: '🪦 Ping the DeadChat role',

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral:true });

            const commandName = 'revive';
            const guildId = interaction.guild.id;
            const requiredRole = ['1296071593075675148'];

            let cooldown = await Cooldown.findOne({ guildId, commandName });

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
                        ephemeral: true,
                    });
                    return;
                }
    
                if (!cooldown) {
                    cooldown = new Cooldown({ guildId, commandName });
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
