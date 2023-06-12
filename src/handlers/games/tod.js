const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const TruthQuestion = require('../../database/models/truthQuestion');

module.exports = async (client, interaction, args) => {
  // Check if interaction is defined
  if (!interaction) {
    return;
  }

  // Get the custom ID of the button that was clicked
  const buttonID = interaction.customId;

  // Retrieve a random truth or dare question from the database based on the button clicked
  const question = await TruthQuestion.aggregate([{ $match: { type: buttonID } }, { $sample: { size: 1 } }]);

  // Build the embed using the retrieved question
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Truth or Dare')
    .setDescription('Choose your destiny!')
    .addFields(
      { name: 'Type', value: question[0].type, inline: true },
      { name: 'Rating', value: question[0].rating, inline: true },
      { name: 'Question', value: question[0].question }
    );

  // Build the button row
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('truth')
        .setLabel('Truth')
        .setStyle('2'),
      new ButtonBuilder()
        .setCustomId('dare')
        .setLabel('Dare')
        .setStyle('3')
    );

  // Replace the original message with the new embed and button row
  await interaction.message.send({ embeds: [embed], components: [row] });
};
