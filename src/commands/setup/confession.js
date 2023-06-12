const Confession = require('../../database/models/Confession'); // Replace 'path/to/confessionSchema' with the actual path to your confession schema

module.exports = async (client, interaction, args) => {
  const channelId = interaction.options.getChannel('channel').id;
  const guildId = interaction.guildId;

  try {
    // Check if a confession channel already exists for the guild
    const existingConfession = await Confession.findOne({ guildId });

    if (existingConfession) {
      // If a confession channel already exists, update the channelId and save
      existingConfession.channelId = channelId;
      await existingConfession.save();
       client.succNormal(
          {
            text: `Confession channel updated to <#${channelId}>`,
            type: 'ephemeraledit',
          },
          interaction
        );
    } else {
      // If no confession channel exists, create a new confession document
      const confession = new Confession({
        guildId: guildId,
        channelId: channelId
      });

      // Save the confession to MongoDB
      await confession.save();
    client.succNormal(
          {
            text: `Confession channel set to <#${channelId}>`,
            type: 'ephemeraledit',
          },
          interaction
        );
    }
  } catch (error) {
    console.error('Error setting up confession:', error);
    await interaction.editReply('An error occurred while setting up the confession channel.');
  }
};
