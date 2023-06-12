const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');

module.exports={
data: new SlashCommandBuilder()
    .setName('util')
    .setDescription('Utility command')
    .addSubcommand(subcommand =>
        subcommand
            .setName('help')
            .setDescription('Get information about the util command')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('summary')
            .setDescription('Get a summary of recent activity')
           .addStringOption(option =>
                    option.setName('timeframe')
                        .setDescription('timeframe of summary')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Last hour', value: '1 hour ago' },
                    { name: 'Last day', value: '1 day ago' },
                    { name: 'Last week', value: '1 week ago' },
                    { name: 'Last month', value: '1 month ago' }
                        )
             )
            .addStringOption(option =>
                option.setName('custom-time')
                    .setDescription('Enter a custom time in the format of HH:mm:ss')
                    .setRequired(false)
            )
    )
  .addSubcommand(subcommand =>
  subcommand
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('The question for the poll')
        .setRequired(true)
    )
)
  .addSubcommand(subcommand =>
      subcommand
        .setName('qotd')
        .setDescription('Question of the day')
        .addStringOption(option =>
          option
            .setName('question')
            .setDescription('The question you want to ask')
            .setRequired(true)
        )
    ),

   run: async (client, interaction, args) => {
        await interaction.deferReply({ fetchReply: true });
        client.loadSubcommands(client, interaction, args);
    },
};