const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Play games in Bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help') 
                .setDescription('Get information about the games category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('8ball')
                .setDescription('Ask the bot a question')
                .addStringOption(option => option.setName('question').setDescription('The question you want to ask').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fasttype')
                .setDescription('Learn to type faster'),
        )
     .addSubcommand(subcommand =>
    subcommand
        .setName('tictactoe')
        .setDescription('Play Tic Tac Toe against AI or another player')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('Select another player')
        )
)


        .addSubcommand(subcommand =>
            subcommand
                .setName('music-trivia')
                .setDescription('Play music trivia')
                .addNumberOption(option => option.setName('number').setDescription('The amount of songs').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roll')
                .setDescription('Roll a die'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rps')
                .setDescription('Play rock paper scissors against the bot')
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription('Choose what you want')
                        .setRequired(true)
                        .addChoices(
                            { name: '🪨 Rock', value: 'rock' },
                            { name: '📃 Paper', value: 'paper' },
                            { name: '✂️ Scissors', value: 'scissors' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skipword')
                .setDescription('Skip the current word'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('snake')
                .setDescription('Playing the game snake'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('trivia')
                .setDescription('Play Trivia'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('willyoupressthebutton')
                .setDescription('Play Will You Press The Button'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('wouldyourather')
                .setDescription('Play Would You Rather'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tod')
                .setDescription('Play Truth or Dare'),
        )
  .addSubcommand(subcommand =>
            subcommand
                .setName('nhie')
                .setDescription('Play Never Have I Ever'),
        )
  .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End the game')
        .addStringOption(option =>
          option
            .setName('game')
            .setDescription('Choose the game to end')
            .setRequired(true)
            .addChoices(
              { name: 'TruthorDare', value: '123' },
              { name: 'Antakshari', value: '12' }
            )
        )
    )
      .addSubcommand(subcommand =>
      subcommand
        .setName('play')
        .setDescription('Enroll in a game')
        .addStringOption(option =>
          option
            .setName('game')
            .setDescription('Choose a game to play')
            .setRequired(true)
            .addChoices(
              { name: 'TruthorDare', value: '123' },
              { name: 'Antakshari', value: '12' }
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all enrolled users')
        .addStringOption(option =>
          option
            .setName('game')
            .setDescription('Filter by game')
            .addChoices(
              { name: 'TruthorDare', value: '123' },
              { name: 'Antakshari', value: '12' }
            )
        )
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
