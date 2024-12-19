const { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require('discord.js');
const AutoReaction = require('../../models/AutoReaction');
const emoji = require('node-emoji');

    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

module.exports = {
    deleted: false,
    name: 'autoreact',
    description: 'Manage your autoreactions',
    options: [
        {
            name: 'add',
            description: '🙂 Add an autoreaction to a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'reaction',
                    description: 'Emoji(s) to react with',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'channel',
                    description: 'Channel to react in',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                    channelTypes: [ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.GuildForum] //Foren funktionieren nicht mit neuen postst rn
                },
                {
                    name: 'type',
                    description: 'Type of message to react to (or not)',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: 'Links/Gifs Only', value: 'links' },
                        { name: 'Images Only', value: 'pictures' },
                        { name: 'Text Only', value: 'text' },
                        { name: 'No Bots', value: 'no_bots' },
                        { name: 'Bot Only', value: 'bot_only' }
                    ]
                }
            ],
        },
        {
            name: 'remove',
            description: '🙂 Remove an autoreaction from a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Channel to stop current autoreaction',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread],
                    required: true,
                },
                {
                    name: 'reaction',
                    description: 'Emoji(s) to react with',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            name: 'edit',
            description: '🙂 Edit an autoreaction of a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'Channel of which to edit the current autoreaction',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread],
                    required: true,
                },
                {
                    name: 'reaction',
                    description: 'Current Emoji used in this channel',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'new-reaction',
                    description: 'New Emoji(s) to react instead',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        },
        {
            name: 'list',
            description: '🙂 Shows all autoreactions of this server',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],

    callback: async (client, interaction) => {

        try {
            await interaction.deferReply({ephemeral: true,});

            // Check for MANAGE_CHANNELS permission
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                interaction.editReply({ content: `You don't have the required permissions.`});
                return;
            }
            
            const subCommand = interaction.options.getSubcommand();
            const guildId = interaction.guild.id;
            const channelId = interaction.options.getChannel('channel').id;
            const emojiId = interaction.options.getString('reaction');
            const type = interaction.options.getString('type') || '';

            const emojiRegex = /<a?:[a-zA-Z0-9_]+:[0-9]+>|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;
            const emoji = emojiId.match(emojiRegex);
            // const emojiArray = emoji.map(emoji => emoji.startsWith('<') ? emoji : emoji.toString());
            // const convertedEmojis = emojiArray.map(emoji => emoji.startsWith('<') ? emoji : emoji.emoji);
            
            // Check wether the 'reaction' input is an emoji
            if (!emoji || emoji.length === 0) {
                interaction.editReply({ content: 'Your set reaction ist not valid' });
                return;
            }
            if(emoji.length > 3) {
                interaction.editReply({ content: 'Your set reaction ist not valid' });
                return;
            }

            let autoReaction = await AutoReaction.findOne({ guildId: interaction.guild.id, channelId });
            
            switch (subCommand) {
                case 'add':
                    if (autoReaction) {
                        await interaction.editReply({ content: `There is already an autoreaction set for this channel`, ephemeral: true });
                    } else {
                        autoReaction = new AutoReaction({ guildId, channelId, emojiId, type });
                        await Promise.all([autoReaction.save()]);

                        await interaction.editReply({ content: `Your autoreaction has been set to ${emojiId} for <#${channelId}> with ${type}`, ephemeral: true, });
                    }
                    break;
                case 'remove':
                    if (!autoReaction) {
                        await interaction.editReply({ content: 'There is no autoreaction set up for this channel', ephemeral: true });
                    } else {
                        await AutoReaction.deleteMany({ guildId, channelId });
                        
                        interaction.editReply({ content: `Your autoreaction has been removed succesfully from <#${channelId}>`, ephemeral: true });
                    }
                    break;
                case 'edit': //unfinished
                    if (!autoReaction) {
                        interaction.editReply({ content: 'There is no autoreaction set up for this channel or with this emoji', ephemeral: true });
                    } else { 
                        const newEmojiId = interaction.options.getString('new-reaction');

                        await AutoReaction.edit({ emojiId: newEmojiId }); //what is the right function for editing in the database?
                    }
                    break;
                case 'list': //unfinished
                    break;
            };

        } catch (error) {
            console.log(`⚠️  ${error}`);
        }
    }
};