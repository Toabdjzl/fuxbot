const { Client, Message } = require('discord.js');
const AutoReaction = require('../../models/AutoReaction');

/**
 * 
 * @param {Client} client 
 * @param {Message} message
 */

module.exports = async (client, message) => {
    if(message.channel && message.guild) {
        try {
            const autoreactData = await AutoReaction.findOne({guildId: message.guild.id, channelId: message.channel.id});
            // console.log(`------------------------------------\n${autoreactData}\n------------------------------------`); // -> findet richtig alle Einträge, Problem kommt erst später
            if(autoreactData && autoreactData.emojiId && autoreactData.emojiId.length > 0) {
                for(const reaction of autoreactData.emojiId) {
                    // console.log(`${reaction}`);
                    try {
                        const shouldReact = (
                            (autoreactData.type === 'links' && (message.attachments.size > 0 || /(https?:\/\/[^\s]+)/g.test(message.content))) ||
                            (autoreactData.type === 'pictures' && message.attachments.size > 0) ||
                            (autoreactData.type === 'text' && message.attachments.size === 0 && !/(https?:\/\/[^\s]+)/g.test(message.content)) ||
                            (autoreactData.type === 'bot_only' && message.author.bot) ||
                            (autoreactData.type === 'no_bots' && !message.author.bot) ||
                            !autoreactData.type
                        );
    
                        if(shouldReact) {
                            await message.react(reaction);
                        }
                    } catch (error) {
                        console.log(`[${new Date().toLocaleString()} - Autoreact] Ich konnte nicht auf die Nachricht reagieren\nChannel: ${message.channel.id}`.yellow);
                    }
                }
            }
        } catch (error) {
            console.log(`[${new Date().toLocaleString()}] Fehler beim Abrufen von Autoreact-Daten oder beim Reagieren auf die Nachricht:`, error);
        }
    }
}