const Tod = require('../../database/models/tod');
const Antakshari = require('../../database/models/antakshari');
module.exports = async (client, interaction, args) => {
  const game = args[0].value;
  let GameModel;

  if (game === '123') { // TruthorDare
    GameModel = Tod;
  } else if (game === '12') { // Antakshari
    GameModel = Antakshari;
  } else {
    return client.errNormal({
      error: `Invalid game option: ${game}`,
      type: 'editreply'
    }, interaction);
  }

  GameModel.deleteMany({ guildId: interaction.guild.id }, (err, data) => {
    if (err) {
      return client.errNormal({
        error: `An error occurred while deleting players from the ${game} game`,
        type: 'editreply'
      }, interaction);
    } else {
      client.succNormal({
        text: `All players have been removed from the ${game} game`,
        type: 'ephemeraledit'
      }, interaction);
    }
  });
};
