module.exports = async (client, interaction, args) => {
  // Get the question from the interaction options
  const question = interaction.options.getString('question');

  // Create the poll embed
  client.poll({
    title: 'Poll',
    desc: question,
    color: '#FFA500',
    footer: 'React with ✅ or ❌ to vote.',
    type: 'editreply'
  }, interaction).then(async (msg) => {
			// Add reactions to message
			await msg.react('✅');
			await msg.react('❌');
		

  


};
