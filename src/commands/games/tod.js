const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const TruthQuestion = require('../../database/models/truthQuestion');

module.exports = async (client, interaction, args) => {
      // Retrieve a random truth question from the database
      const question = await TruthQuestion.aggregate([{ $sample: { size: 1 } }]);

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
            .setStyle('3'),
          new ButtonBuilder()
            .setCustomId('dare')
            .setLabel('Dare')
            .setStyle('4')
        );

      // Send the embed and button row to the channel
      interaction.channel.send({ embeds: [embed], components: [row] });
  return
    } 
