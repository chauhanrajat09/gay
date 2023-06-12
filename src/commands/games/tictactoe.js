const TicTacToe = require('discord-tictactoe');

module.exports = async (client, interaction, args) => {
  const player = interaction.options.getUser('player');
  const game = new TicTacToe({ language: 'en', commandOptionName: 'player'});


  try {
    await game.handleInteraction(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply('An error occurred while playing the tic-tac-toe game.');
  }
};
