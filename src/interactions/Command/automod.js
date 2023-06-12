const { CommandInteraction, Client, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const Developer = require('../../database/models/badge');
const mongoose = require('mongoose');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Manage the auto mod')
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('Get information about the auto setup commands')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('antiinvite')
        .setDescription('Enable/disable antiinvite')
        .addBooleanOption(option =>
          option
            .setName('active')
            .setDescription('Select a boolean')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('antilinks')
        .setDescription('Enable/disable antilinks')
        .addBooleanOption(option =>
          option
            .setName('active')
            .setDescription('Select a boolean')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('antispam')
        .setDescription('Enable/disable antispam')
        .addBooleanOption(option =>
          option
            .setName('active')
            .setDescription('Select a boolean')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('linkschannel')
        .setDescription('Add a channel that is allowed to send links')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('What do you want to do with the channel?')
            .setRequired(true)
            .addChoices(
              { name: 'Add', value: 'add' },
              { name: 'Remove', value: 'remove' }
            )
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Select a channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName('blacklist')
        .setDescription('Manage the blacklist')
        .addSubcommand(subcommand =>
          subcommand.setName('display').setDescription('Show the whole blacklist')
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('add')
            .setDescription('Add a word to the blacklist')
            .addStringOption(option =>
              option.setName('word').setDescription('The word for the blacklist').setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('remove')
            .setDescription('Remove a word from the blacklist')
            .addStringOption(option =>
              option.setName('word').setDescription('The word for the blacklist').setRequired(true)
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('language')
        .setDescription('Set the language for the auto mod')
        .addStringOption(option =>
          option
            .setName('language')
            .setDescription('Select a language')
            .setRequired(true)
            .addChoices(
              { name: 'English', value: 'en' },
              { name: 'Hindi', value: 'hi' },
              { name: 'Spanish', value: 'es' },
              { name: 'Chinese', value: 'zh' }
            )
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Select a channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('autorespond')
        .setDescription('Set up an autoresponse for a specified keyword')
        .addStringOption(option =>
          option.setName('keyword').setDescription('Enter the keyword for the autoresponse').setRequired(true)
        )
        .addStringOption(option =>
          option.setName('response').setDescription('Enter the response for the keyword').setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('autorespondremovee')
        .setDescription('Remove an autoresponse for a specified keyword')
        .addStringOption(option =>
          option.setName('keyword').setDescription('Enter the keyword for the autoresponse').setRequired(true)
        )
    ),

 
    run: async (client, interaction, args) => {
        await interaction.deferReply({ fetchReply: true });
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 