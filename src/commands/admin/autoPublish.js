const { ApplicationCommandOptionType, Application, PermissionFlagsBits, ChannelType } = require('discord.js');
const AutoPublishing = require('../../models/AutoPublishing');

    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

module.exports = {
    deleted: false,
    name: 'autopublish',
    description: 'Manage your autopublishings',
    options: [
        {
            name: 'add',
            description: '📢 Add an autopublishing to a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Channel to publish from',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channelTypes: [ChannelType.GuildAnnouncement]
                }
            ]
        },
        {
            name: 'remove',
            description: '📢 Remove an autopublishing from a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Channel to remove the publishing from',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channelTypes: [ChannelType.GuildAnnouncement]
                }
            ]
        },
        {
            name: 'list',
            description: '📢 Shows all autopublishings of this server',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],

    callback: async (client, interaction) => {

        try {
            await interaction.deferReply({ephemeral: true});

            // Check for MANAGE_CHANNELS permission
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                interaction.editReply({ content: `You don't have the required permissions.`});
                return;
            }

            const subCommand = interaction.options.getSubcommand();
            const guildId = interaction.guild.id;
            const channelId = interaction.options.getChannel('channel').id;

            let autoPublishing = await AutoPublishing.findOne({ guildId, channelId });

            switch(subCommand) {
                case 'add':
                    if (autoPublishing) {
                        await interaction.editReply({ content: `There is already an autopublishing set for this channel`, ephemeral: true, });
                    } else {
                        autoPublishing = new AutoPublishing({ guildId, channelId });
                        await Promise.all([autoPublishing.save()]);

                        await interaction.editReply({ content: `The autopublishing has been set for <#${channelId}>`, ephemeral: true, })
                    }
                    break;
                case 'remove':
                    if (!autoPublishing) {
                        await interaction.editReply({ content: `There is no autopublishing set for this channel`, ephemeral: true, });
                    } else {
                        await AutoPublishing.deleteMany({ guildId, channelId });

                        interaction.editReply({ content: `The autopublishing for <#${channelId}> has been removed`, ephemeral: true })
                    }
                    break;
                case 'list':
                    break;
            }

        } catch (error) {
            console.log(`⚠️  ${error}`);
        }
    }
};