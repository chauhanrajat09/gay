 const Discord = require('discord.js');
const Captcha = require("@haileybot/captcha-generator");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Tod = require('../../database/models/tod');
const TruthQuestion = require('../../database/models/truthQuestion');
const DareQuestion = require('../../database/models/darequestions');
const NHIEStatement = require('../../database/models/nhieStatement');
const reactionSchema = require("../../database/models/reactionRoles");
const banSchema = require("../../database/models/userBans");
const verify = require("../../database/models/verify");
const Commands = require("../../database/models/customCommand");
const CommandsSchema = require("../../database/models/customCommandAdvanced");
module.exports = async (client, interaction) => {
  if (interaction.isButton() && interaction.customId == "dare") {
  const question = await DareQuestion.aggregate([{ $sample: { size: 1 } }]);

  // Build the embed using the retrieved question
  const embed = new Discord.EmbedBuilder()
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL({ size: 1024 })
    })
    .setColor(client.config.colors.normal)
    .setFooter({
      text: client.config.discord.footer,
      iconURL: client.user.avatarURL({ size: 1024 })
    })
    .setTimestamp()
    .setTitle('Truth or Dare')
    .setDescription(`You chose dare! Requested by ${interaction.user.toString()}.`)
    .addFields(
      { name: 'Type', value: question[0].type, inline: true },
      { name: 'Rating', value: question[0].rating, inline: true },
      { name: 'Question', value: question[0].question }
    );

  const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('truth')
        .setLabel('Truth')
        .setStyle('3'),
      new Discord.ButtonBuilder()
        .setCustomId('dare')
        .setLabel('Dare')
        .setStyle('4'),
     new Discord.ButtonBuilder()
        .setCustomId('random')
        .setLabel('Random')
        .setStyle('1')
    );
  interaction.reply({ embeds: [embed], components: [row] });
}
}