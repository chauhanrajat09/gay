const Discord = require('discord.js');
const Schema = require('../../database/models/Confession');

module.exports = async (client, interaction, args) => {
  const confessionContent = interaction.options.getString('content');

  try {
    // Find the confession channel from the database
    const confessionChannel = await Schema.findOne({ guildId: interaction.guildId });

    if (!confessionChannel) {
      // If the confession channel is not found, reply with "Not enabled" message
      return client.errNormal(
        {
          error: `Confession channel not found. Confessions are not enabled.`,
          type: 'editreply',
        },
        interaction
      );
    }

    // Send the confession to the confession channel
    const channel = client.channels.cache.get(confessionChannel.channelId);
    if (!channel) {
      // If the channel is not found, reply with "Not enabled" message
      return client.errNormal(
        {
          error: `Confession channel not found. Confessions are not enabled.`,
          type: 'editreply',
        },
        interaction
      );
    }

    // Create a new embed
const embed = new Discord.EmbedBuilder()
    .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL({ size: 1024 })
    })
    .setColor(client.config.colors.normal)
    .setFooter({
        text: client.config.discord.footer,
        iconURL: client.user.avatarURL({ size: 1024 })
    }) // Added closing parenthesis here
    .setDescription('🙊 New Confession 🙊')
    .addFields({ name: "Confession!!", value: `${confessionContent}` })
    .setTimestamp(); // Send the confession message as an embed
   await channel.send({ embeds: [embed] });

    // Reply with a success message
    const successMessage = await client.succNormal(
      {
        text: `Your confession has been sent successfully`,
        type: 'ephemeraledit',
      },
      interaction
    );

    // Delete the success message after 5 seconds
    setTimeout(() => {
      successMessage.delete().catch(console.error);
    }, 5000);
  } catch (error) {
    console.error('Error sending confession:', error);
    interaction.editReply('An error occurred while sending the confession. Please try again later.');
  }
};
