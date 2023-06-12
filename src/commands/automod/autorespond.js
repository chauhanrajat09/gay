const Discord = require('discord.js');

const Schema = require('../../database/models/autorespond');

module.exports = async (client, interaction, args) => {
  const keyword = interaction.options.getString('keyword');
  const response = interaction.options.getString('response');
  const user = interaction.user;
  const timestamp = Date.now(); // Timestamp added here

  Schema.findOne(
    { Guild: interaction.guild.id, keyword: keyword },
    async (err, data) => {
      if (data) {
        return client.errNormal(
          {
            error: `a autorespond already exist`,
            type: 'editreply',
          },
          interaction
        );
      } else {
        new Schema({
          Guild: interaction.guild.id,
          Keyword: keyword,
          Response: response,
        }).save();
        client.succNormal(
          {
            text: `Your Autoresponse has been set`,
            type: 'ephemeraledit',
            
          },
          interaction
        );

        client.embed(
          {
            desc: `Autoresponse has been set! **response:** ${response} **keyword:** ${keyword}`, // Timestamp displayed here
           
          },
          interaction.channel
        );
      }
    }
  );
};