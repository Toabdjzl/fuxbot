const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');


module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    const embed_devonly = {
        description: 'Only developers are allowed to run this command.',
        color: 0xff8533
    };
    const embed_wronglocation = {
        description: 'This command cannot be ran here.',
        color: 0xff8533
    };
    const embed_missingpermissions = {
        description: 'Not enough permissions',
        color: 0xff8533
    };
    const embed_botmissingpermissions = {
        description: "I don't have enough permissions.",
        color: 0xff8533
    };

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({ embeds: [embed_devonly], ephemeral: true});
                return;
            }           
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({ embeds: [embed_wronglocation], ephemeral: true});
                return;
            }  
        }

        if (commandObject.permissionsRequired?.lenght) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({ embeds: [embed_missingpermissions], ephemeral: true});
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.lenght) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({ embeds: [embed_botmissingpermissions], ephemeral: true});
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`⚠️  ${error}`);
    }
};