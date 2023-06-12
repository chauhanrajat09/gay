const Discord = require('discord.js');

const Schema = require('../../database/models/bafk');
module.exports = async (client, interaction, args) => {
  const reason = interaction.options.getString('reason') || `Not specified`;
  const user = interaction.user;
  const timestamp = Date.now(); // Timestamp added here

  Schema.findOne(
    {  User: interaction.user.id },
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
         
          User: interaction.user.id,
          Message: reason,
          Timestamp: timestamp, // Timestamp added here
        }).save();

    

        client.succNormal(
          {
            
            text: `Your AFK has been set up successfully across all servers`,
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
