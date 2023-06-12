const Discord = require('discord.js');

const Schema = require('../../database/models/afk');
module.exports = async (client, interaction, args) => {
  const reason = interaction.options.getString('reason') || `Not specified`;
  const user = interaction.user;
  const timestamp = Date.now(); // Timestamp added here

  Schema.findOne(
    { Guild: interaction.guild.id, User: interaction.user.id },
    async (err, data) => {
      if (data) {
        return client.errNormal(
          {
            error: `You're already afk!`,
            type: 'editreply',
          },
          interaction
        );
      } else {
        new Schema({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          Message: reason,
          Timestamp: timestamp, // Timestamp added here
        }).save();

        if (!interaction.member.displayName.includes(`[AFK] `)) {
          interaction.member
            .setNickname(`[AFK] ` + interaction.member.displayName)
            .catch((e) => {});
        }

        client.succNormal(
          {
            
            text: `Your AFK has been set up successfully`,
            fields: ({ name: "Reason", value: `${reason}` }),
            type: 'ephemeraledit',
            thumbnail: user.displayAvatarURL({ dynamic: false, size: 1024 }),
            image: 'image',
          },
          interaction
        );

        
      }
    }
  );
};
