const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const NHIEStatement = require('../../database/models/nhieStatement');

module.exports = async (client, interaction, args) => {
  // Retrieve a random Never Have I Ever statement from the database
  const question = await NHIEStatement.aggregate([{ $sample: { size: 1 } }]);

  // Build the embed using the retrieved statement
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
    .setTitle('Never Have I Ever')
    .setDescription('```Have You?```')
     .addFields(
          { name: 'Type', value: ${question[0].type, inline: true} },
          { name: 'Rating', value: question[0].rating, inline: true },
          { name: 'Question', value: question[0].question }
        );

  // Build the button row
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('nhie_yes')
        .setLabel('I have')
        .setStyle('3'),
      new ButtonBuilder()
        .setCustomId('nhie_no')
        .setLabel('I haven\'t')
        .setStyle('4'),
      new ButtonBuilder()
        .setCustomId('nhie_new')
        .setLabel('New Statement')
        .setStyle('1')
    );

  // Send the embed and button row to the channel
  await interaction.channel.send({ embeds: [embed], components: [row] });
  return;
};
