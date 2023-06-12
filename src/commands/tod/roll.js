const Tod = require('../../database/models/tod');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
module.exports = async (client, interaction, args) => {
  Tod.aggregate([
    { $match: { guildId: interaction.guild.id } },
    { $sample: { size: 2 } }
  ], (err, data) => {
    if (err) {
      return client.errNormal({
        error: 'An error occurred while retrieving players for the TOD game',
        type: 'editreply'
      }, interaction);
    } else if (data.length < 2) {
      return client.errNormal({
        error: 'There are not enough players in the TOD game',
        type: 'editreply'
      }, interaction);
    } else {
      const [player1, player2] = data;
      const players = [player1.userId, player2.userId];
      const askerId = players[Math.floor(Math.random() * players.length)];
      const categories = ['truth', 'dare'];
      const categoryIndex = Math.floor(Math.random() * 2);
      const category = categories[categoryIndex];
      const asker = `<@${askerId}>`;
      const asked = players.filter(playerId => playerId !== askerId)[0];
      const askedName = `<@${asked}>`;
      const text = `${asker} asks ${askedName}: ${category} `
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
        .setTitle(`${category}`)
        .setDescription('Get Ready!')
        .addFields(
          { name: 'Task', value: text, inline: true }
        );

      // Build the button row
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('reroll')
            .setLabel('Reroll')
            .setStyle('1')
        );

      // Send the embed and button row to the channel
      interaction.channel.send({ embeds: [embed], components: [row] });
    }
  });
};
