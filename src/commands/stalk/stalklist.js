const Discord = require('discord.js');
const Schema = require('../../database/models/stalker'); // Replace with appropriate database model

module.exports = {
  name: 'stalklist',
  description: 'Show all users that you are currently stalking',
  async execute(client, interaction, args) {
    const stalkedUsers = await Schema.find({ Stalker: interaction.user.id }).select('Victim');
    if (stalkedUsers.length < 1) {
      return interaction.reply('You are not currently stalking anyone.');
    }
    const userList = stalkedUsers.map(u => `<@${u.Victim}>`);
    return interaction.reply(`You are currently stalking: ${userList.join(', ')}`);
  },
};
