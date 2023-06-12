const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = async (client, interaction) => {
  const question = interaction.options.getString('question');
  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL({ size: 1024 })
    })
    .setColor(client.config.colors.normal)
    .setTitle('Question of the Day')
    .setDescription(question)
    .setFooter({
      text: 'QOTD',
      iconURL: client.user.avatarURL({ size: 1024 })
    })
    .setTimestamp();

  // Build the button row
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('qotd')
        .setLabel('Reply')
        .setStyle('1')
        
    );

  await interaction.channel.send({ embeds: [embed], components: [row] });
};
