const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const stalker = require('../../database/models/stalker.js');

module.exports = async (client, interaction, args) => {
  const stalkedUser = interaction.options.getUser('user');

  const existingRequest = await stalker.findOne({
    Stalker: interaction.user.id,
    Victim: stalkedUser.id,
  });

  if (existingRequest) {
    return client.errNormal(
      {
        error: `You have already sent a stalking request to this person`,
        type: 'editreply',
      },
      interaction
    );
  }

  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('allow')
        .setLabel('Allow')
        .setStyle('3'),
      new ButtonBuilder()
        .setCustomId('deny')
        .setLabel('Deny')
        .setStyle('4')
    );

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('Stalking Request')
    .setDescription(`User <@${stalkedUser.id}> wants to stalk you!`);

  const newStalker = new stalker({
    Stalker: interaction.user.id,
    Victim: stalkedUser.id,
  });

  await newStalker.save();

  await stalkedUser.send({ embeds: [embed], components: [actionRow] });

  client.succNormal(
    {
      text: `Stalking Request Sent to ${stalkedUser.username}!`,
      type: 'editreply',
    },
    interaction
  );
};
