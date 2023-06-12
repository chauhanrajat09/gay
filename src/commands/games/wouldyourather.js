const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const WouldYouRatherQuestion = require('../../database/models/wouldYouRatherQuestion');

module.exports = async (client, interaction, args) => {
  try {
    // Retrieve a random "Would You Rather" question from the database
    const question = await WouldYouRatherQuestion.aggregate([{ $sample: { size: 1 } }]);
    
    // Build the embed using the retrieved question
   const embed = new EmbedBuilder()
  .setAuthor({
    name: client.user.username,
    iconURL: client.user.avatarURL({ size: 1024 })
  })
  .setColor(client.config.colors.normal)
  .setFooter({
    text: client.config.discord.footer,
    iconURL: client.user.avatarURL({ size: 1024 })
  })
  .setTimestamp()
  .setTitle('Would You Rather')
  .setDescription(`Would You Rather? Requested by ${interaction.user.username}.`)
  .addFields(
    { name: 'Rating', value: question[0].rating, inline: true },
    { name: 'Question', value: question[0].question, inline: false },
    { name: 'Option 1', value: question[0].option1, inline: true },
    { name: 'Option 2', value: question[0].option2, inline: true }
  );


    // Build the button row
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('option1')
          .setLabel('option1')
          .setStyle('PRIMARY'),
        new ButtonBuilder()
          .setCustomId('option2')
          .setLabel('option2')
          .setStyle('PRIMARY')
      );

    // Send the embed and button row to the channel
    interaction.reply({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error(error);
    interaction.update('An error occurred while retrieving the question.');
  }
};
