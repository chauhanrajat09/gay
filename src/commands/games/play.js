const Tod = require('../../database/models/tod');
const Antakshari = require('../../database/models/antakshari');

module.exports = async (client, interaction, args) => {
  const game = args[0].value.trim(); // Get the game option value and trim whitespace

  if (game === '123') {
    try {
      const data = await Tod.findOne({ userId: interaction.user.id, guildId: interaction.guild.id }).exec(); // Use async/await and exec() to get the query result

      if (data) {
        return client.errNormal({
          error: 'You are already enrolled in TOD game!',
          type: 'editreply'
        }, interaction);
      } else {
        await Tod.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        return client.succNormal({
          text: 'You have been enrolled into TOD game',
          type: 'ephemeraledit',
          thumbnail: interaction.user.displayAvatarURL({ dynamic: false, size: 1024 }),
        }, interaction);
      }
    } catch (err) {
      console.error(err);
      return client.errNormal({
        error: 'Error occurred while processing the request',
        type: 'editreply'
      }, interaction);
    }
  } else if (game === '12') {
    try {
      const data = await Antakshari.findOne({ userId: interaction.user.id, guildId: interaction.guild.id }).exec();

      if (data) {
        return client.errNormal({
          error: 'You are already enrolled in Antakshari game!',
          type: 'editreply'
        }, interaction);
      } else {
        await Antakshari.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        return client.succNormal({
          text: 'You have been enrolled into Antakshari game',
          type: 'ephemeraledit',
          thumbnail: interaction.user.displayAvatarURL({ dynamic: false, size: 1024 }),
        }, interaction);
      }
    } catch (err) {
      console.error(err);
      return client.errNormal({
        error: 'Error occurred while processing the request',
        type: 'editreply'
      }, interaction);
    }
  } else {
    return client.errNormal({
      error: 'Invalid game option value!',
      type: 'editreply'
    }, interaction);
  }
};
