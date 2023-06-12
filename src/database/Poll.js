module.exports = async (client, interaction, args) => {
  // Get the question from the interaction options
  const question = interaction.options.getString('question');

  // Create the poll embed
   const embed = client.embed({
    title: 'Poll',
    desc: question,
    color: '#FFA500',
    footer: 'React with ✅ or ❌ to vote.',
    type: 'editreply'
  }, interaction);

  

  // Add tick and cross reactions to the poll message
  await embed.react('✅'); // Tick emoji
  await embed.react('❌'); // Cross emoji
};
