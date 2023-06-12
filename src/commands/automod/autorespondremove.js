const Discord = require('discord.js');

const Schema = require('../../database/models/autorespond');

module.exports = async (client, interaction, args) => {
  const keyword = interaction.options.getString('keyword');
  const user = interaction.user;
  const timestamp = Date.now(); // Timestamp added here

  Schema.findOne(
    { Guild: interaction.guild.id, Keyword: keyword },
    async (err, data) => {
      if (data) {
        await Schema.findOneAndDelete({ Guild: interaction.guild.id, Keyword: keyword });
        client.succNormal(
          {
            text: `Your Autoresponse has been removed`,
            type: 'ephemeraledit',
          },
          interaction
        );

        client.embed(
          {
            desc: `Autoresponse has been removed! **keyword:** ${keyword}`, // Timestamp displayed here
          },
          interaction.channel
        );
      } else {
        client.errNormal(
          {
            error: `an autorespond with the keyword "${keyword}" does not exist`,
            type: 'editreply',
          },
          interaction
        );
      }
    }
  );
};
