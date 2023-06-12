const Discord = require('discord.js');
const Schema = require("../../database/models/guessWord");
const Economy = require("../../database/models/economy");

module.exports = async (client, interaction, args) => {
  let wordList = client.config.wordList;

  Schema.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id }, async (err, data) => {
    if (data) {
      try {
        wordList = wordList.split("\n");
        var word = wordList[Math.floor(Math.random() * wordList.length)];
        var shuffled = word.split('').sort(function () { return 0.5 - Math.random() }).join('');

        // Check if user has enough money to skip
        const economyData = await Economy.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
        if (economyData.Money < 50) {
          return client.errNormal({
            error: "You don't have enough money to skip the word!",
            type: 'ephemeral'
          }, interaction)
        }

        data.Word = word;
        data.save();

        // Subtract 50 money from user
        economyData.Money -= 50;
        await economyData.save();

        client.succNormal({ 
          text: `Word skipped successfully! You lost 50 money!`,
          type: 'ephemeral'
        }, interaction);

        return client.embed({ 
          title: `💬・Guess the word`, 
          desc: `Put the letters in the right position! \n\n🔀 ${shuffled.toLowerCase()}`,
        }, interaction.channel)
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      client.errNormal({
        error: "You are not in the right channel!",
        type: 'editreply'
      }, interaction)
    }
  })
}
