const moment = require('moment');

module.exports = async (client, interaction, args) => {
  // Calculate the timestamp for one hour ago
  const oneHourAgo = moment().subtract(1, 'hour');
  const oneHourAgoTimestamp = oneHourAgo.valueOf();

  console.log(`Timestamp for one hour ago: ${oneHourAgoTimestamp}`);

  // Calculate the Snowflake IDs for one hour ago
  const DISCORD_EPOCH = 1420070400000;
  const startSnowflake = 1686488248000;
  const endSnowflake = 1686527848000;
  console.log(`Custom start Snowflake ID: ${startSnowflake}`);
  console.log(`Custom end Snowflake ID: ${endSnowflake}`);

  // Retrieve all messages sent within the specified timeframe
  const messages = await interaction.channel.messages.fetch({
    after: startSnowflake,
    before: endSnowflake,
  });

  console.log(`Retrieved ${messages.size} messages.`);

  // Map the messages to a simplified format
  const messageData = messages.map(message => ({
    id: message.id,
    author: {
      username: message.author.username,
      discriminator: message.author.discriminator,
    },
    content: message.content,
  }));

  // Send the summary as a reply
  const summaryText = `Here's a summary of activity from one hour ago:`;
  await interaction.editReply({
    content: `${summaryText}\n\`\`\`json\n${JSON.stringify(messageData, null, 2)}\n\`\`\``,
    ephemeral: true,
  });
};
