const AfkStatus = require('../../models/AfkStatus');

module.exports = async (client, message) => {
	if (message.author.bot) return;
	const check = await AfkStatus.findOne({ guildId: message.guild.id, userId: message.author.id });
	if (check) {
		await AfkStatus.deleteMany({ guildId: message.guild.id, userId: message.author.id });
		const m1 = await message.reply({ content: `Welcome back, ${message.author}! I have removed your afk status.` });
		// add: remove message after x amount of time
		// add: show how long the user was afk
	}
	else {
		const members = message.mentions.users.first();
		if (!members) return;
		const Data = await AfkStatus.findOne({ guildId: message.guild.id, userId: members.id });
		if (!Data) return;

		const member = message.guild.members.cache.get(members.id);
		const msg = Data.statusMessage;
		if (message.content.includes(members) && Data.statusMessage) {
			const m = await message.reply({ content: `${member.user} is currently afk with reason **${msg}**`, allowedMentions: { parse: [] } });
		}
		else if (message.content.includes(members) && !Data.statusMessage) {
			{
				const m = await message.reply({ content: `${member.user} is currently afk`, allowedMentions: { parse: [] } });
			}
		}
	}
};