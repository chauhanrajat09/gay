const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

// Import the database schema for tod tasks
const Schema = require('../../database/models/tod');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tod')
    .setDescription('Custom Truth or Dare')
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Get information about the Tod commands')
    )
    
    .addSubcommand(subcommand =>
      subcommand
        .setName('roll')
        .setDescription('Roll a Random User and Truth or Dare form List')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a User from game')
        .addUserOption(option => 
          option
            .setName('user')
            .setDescription('The user whose task to remove (default is yourself)')
            .setRequired(false)
        )
    )
    ,

  /** 
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    await interaction.deferReply({ fetchReply: true });
    // Call the `loadSubcommands` function with appropriate arguments
    client.loadSubcommands(client, interaction, args);
  },
};
