const Antakshari = require('../../database/models/antakshari');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = async (client, interaction, args) => {
  Antakshari.aggregate([
    { $match: { guildId: interaction.guild.id } },
    { $sample: { size: 1 } }
  ], (err, data) => {
    if (err) {
      return client.errNormal({
        error: 'An error occurred while retrieving a player for antakshari',
        type: 'editreply'
      }, interaction);
    } else if (data.length === 0) {
      return client.errNormal({
        error: 'There are no players in antakshari',
        type: 'editreply'
      }, interaction);
    } else {
      const [player] = data;
      const user = `<@${player.userId}>`;
      const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      const text = `${user} you have to start with the letter **${letter}**`;

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
        .setTitle('Antakshari')
        .setDescription('Let the game begin!')
        .addFields(
          { name: 'Instructions', value: 'The game starts with a letter, and you have to say a word starting with the last letter of the previous word.' },
          { name: 'Turn', value: text, inline: true }
        );

      // Build the button row
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle('1')
        );

      // Send the embed and button row to the channel
      interaction.channel.send({ embeds: [embed], components: [row] });
    }
  });
};
