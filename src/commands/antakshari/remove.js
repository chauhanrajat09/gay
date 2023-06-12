const Tod = require('../../database/models/antakshari');

module.exports = async (client, interaction, args) => {
  let userId = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.user.id;

  Tod.findOneAndDelete({ userId: userId, guildId: interaction.guild.id }, (err, data) => {
    if (!data) {
      return client.errNormal({
        error: 'This user is not enrolled in antakshari game!',
        type: 'editreply'
      }, interaction);
    } else {
      client.succNormal({
        text: 'The user has been removed from the antakshari game',
        type: 'ephemeraledit'
        
      }, interaction);
    }
  });
};
