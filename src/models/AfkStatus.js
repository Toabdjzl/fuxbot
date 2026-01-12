const { Schema, model } = require('mongoose');

const afkStatusSchema = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	statusMessage: {
		type:String,
	},
});

module.exports = model('AfkStatus', afkStatusSchema);