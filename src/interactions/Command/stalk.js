const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/music");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stalk')
    .setDescription('Stalk a specific user')
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Get information about the stalk category commands')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('new')
        .setDescription('Add a new user to your stalking list')
        .addUserOption(option => option.setName('user').setDescription('The user to add to your stalking list, it will send a dm'))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stalklist')
        .setDescription('Show all users that you are currently stalking')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stalkerlist')
        .setDescription('Show all users that are currently stalking you')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ignorechannel')
        .setDescription('Ignore a specific channel from your stalking list')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to ignore from your stalking list'))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stalkremove')
        .setDescription('Remove a user from your stalking list')
        .addUserOption(option => option.setName('user').setDescription('The user to remove from your stalking list'))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stalkerremove')
        .setDescription('Remove a user from the list of users that are stalking you')
        .addUserOption(option => option.setName('user').setDescription('The user to remove from the list of users that are stalking you'))
    ),

  /** 
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    await interaction.deferReply({ fetchReply: true });
    client.loadSubcommands(client, interaction, args);
  },
};
