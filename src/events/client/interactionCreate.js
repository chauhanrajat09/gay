const Discord = require('discord.js');
const Captcha = require("@haileybot/captcha-generator");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Tod = require('../../database/models/tod');
const TruthQuestion = require('../../database/models/truthQuestion');
const DareQuestion = require('../../database/models/darequestions');
const Antakshari = require('../../database/models/antakshari');
const NHIEStatement = require('../../database/models/nhieStatement');
const reactionSchema = require("../../database/models/reactionRoles");
const banSchema = require("../../database/models/userBans");
const verify = require("../../database/models/verify");
const Commands = require("../../database/models/customCommand");
const CommandsSchema = require("../../database/models/customCommandAdvanced");
const Stalker = require('../../database/models/stalker');
module.exports = async (client, interaction) => {
  // Commands
  if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
    banSchema.findOne({ User: interaction.user.id }, async (err, data) => {
      if (data) {
        return client.errNormal({
          error: "You have been banned by the developers of this bot",
          type: 'ephemeral'
        }, interaction);
      }
      else {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) {
          const cmdd = await Commands.findOne({
            Guild: interaction.guild.id,
            Name: interaction.commandName,
          });
          if (cmdd) {
            return interaction.channel.send({ content: cmdd.Responce });
          }

          const cmdx = await CommandsSchema.findOne({
            Guild: interaction.guild.id,
            Name: interaction.commandName,
          });
          if (cmdx) {
            // Remove interaction
            if (cmdx.Action == "Normal") {
              return interaction.reply({ content: cmdx.Responce });
            } else if (cmdx.Action == "Embed") {
              return client.simpleEmbed(
                {
                  desc: `${cmdx.Responce}`,
                  type: 'reply'
                },
                interaction,
              );
            } else if (cmdx.Action == "DM") {
              await interaction.deferReply({ ephemeral: true });
              interaction.editReply({ content: "I have sent you something in your DMs" });
              return interaction.user.send({ content: cmdx.Responce }).catch((e) => {
                client.errNormal(
                  {
                    error: "I can't DM you, maybe you have DM turned off!",
                    type: 'ephemeral'
                  },
                  interaction,
                );
              });
            }
          }
        }
        if (interaction.options._subcommand !== null && interaction.options.getSubcommand() == "help") {
          const commands = interaction.client.commands.filter(x => x.data.name == interaction.commandName).map((x) => x.data.options.map((c) => '`' + c.name + '` - ' + c.description).join("\n"));

          return client.embed({
            title: `❓・Help panel`,
            desc: `Get help with the commands in \`${interaction.commandName}\` \n\n${commands}`,
            type: 'reply'
          }, interaction)
        }

        if (cmd) cmd.run(client, interaction, interaction.options._hoistedOptions).catch(err => {
          client.emit("errorCreate", err, interaction.commandName, interaction)
        })
      }
    })
  }
// experimentation 
 
  // Verify system
  if (interaction.isButton() && interaction.customId == "Bot_verify") {
    const data = await verify.findOne({ Guild: interaction.guild.id, Channel: interaction.channel.id });
    if (data) {
      let captcha = new Captcha();

      try {
        var image = new Discord.AttachmentBuilder(captcha.JPEGStream, { name: "captcha.jpeg" });

        interaction.reply({ files: [image], fetchReply: true }).then(function(msg) {
          const filter = s => s.author.id == interaction.user.id;

          interaction.channel.awaitMessages({ filter, max: 1 }).then(response => {
            if (response.first().content === captcha.value) {
              response.first().delete();
              msg.delete();

              client.succNormal({
                text: "You have been successfully verified!"
              }, interaction.user).catch(error => { })

              var verifyUser = interaction.guild.members.cache.get(interaction.user.id);
              verifyUser.roles.add(data.Role);
            }
            else {
              response.first().delete();
              msg.delete();

              client.errNormal({
                error: "You have answered the captcha incorrectly!",
                type: 'editreply'
              }, interaction).then(msgError => {
                setTimeout(() => {
                  msgError.delete();
                }, 2000)
              })
            }
          })
        })
      }
      catch (error) {
        console.log(error)
      }
    }
    else {
      client.errNormal({
        error: "Verify is disabled in this server! Or you are using the wrong channel!",
        type: 'ephemeral'
      }, interaction);
    }
  }
if (interaction.isButton() && interaction.customId == "truth") {
  const question = await TruthQuestion.aggregate([{ $sample: { size: 1 } }]);

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
    .setDescription(`You chose truth! Requested by ${interaction.user.toString()}.`)

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
 if (interaction.isButton() && interaction.customId == "nhie_new") {
    // Retrieve a new NHIE statement
    const statement = await NHIEStatement.aggregate([{ $sample: { size: 1 } }]);

    // Build the embed using the retrieved statement
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
      .setTitle('Never Have I Ever')
      .setDescription('```Have You?```')
       .addFields(
      { name: 'Type', value: statement[0].type, inline: true },
      { name: 'Rating', value: statement[0].rating, inline: true },
      { name: 'Question', value: statement[0].question }
    );
      

    // Build the button row
    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('nhie_yes')
          .setLabel('I have')
          .setStyle('3'),
        new Discord.ButtonBuilder()
          .setCustomId('nhie_no')
          .setLabel('I haven\'t')
          .setStyle('4'),
        new Discord.ButtonBuilder()
          .setCustomId('nhie_new')
          .setLabel('New Statement')
          .setStyle('1')
      );

    // Send the embed and button row to the channel
    await interaction.channel.send({ embeds: [embed], components: [row] });
   const originalMessage = await interaction.channel.messages.fetch(interaction.message.id);

// Remove all components from the original message
await originalMessage.edit({ components: [] });
  }

if (interaction.isButton() && interaction.customId == "next") {
  Antakshari.aggregate([
    { $match: { guildId: interaction.guild.id } },
    { $sample: { size: 1 } }
  ], async (err, data) => {
    if (err) {
      return client.errNormal({
        error: 'An error occurred while retrieving a player for antakshari',
        type: 'editreply'
      }, interaction);
    } else if (data.length === 0) {
      return client.errNormal({
        error: 'There are no players in antakshari',
        type: 'editreply'
      }, interaction);
    } else {
      const [player] = data;
      const user = `<@${player.userId}>`;
      const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      const text = `${user} you have to start with the letter **${letter}**`;

      const embed = new EmbedBuilder()
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
        .setTitle('Antakshari')
        .setDescription('Let the game begin!')
        .addFields(
          { name: 'Instructions', value: 'The game starts with a letter, and you have to say a word starting with the last letter of the previous word.' },
          { name: 'Turn', value: text, inline: true }
        );

      // Build the button row
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle('1')
        );

      // Send the new embed and remove the buttons from the old message
      const message = await interaction.channel.send({ embeds: [embed], components: [row] });
      const originalMessage = await interaction.channel.messages.fetch(interaction.message.id);
      await originalMessage.delete();
    }
  });
}


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
 // Replace './path/to/stalkerModel' with the actual path to your Mongoose model

if (interaction.isButton() && interaction.customId === "allow") {
  const embeds = interaction.message.embeds;
  if (embeds.length > 0) {
    const description = embeds[0].description;
    const userIdRegex = /<@(\d+)>/;
    const userIdMatch = description.match(userIdRegex);
    if (userIdMatch) {
      const stalkerId = userIdMatch[1];
      console.log(stalkerId); // Log the extracted stalker ID from the description
      
      const victimId = interaction.user.id;
      console.log(victimId); // Log the user ID of the interaction
      
      // Find the existing stalker entry in the database
      Stalker.findOne({ Stalker: stalkerId, Victim: victimId })
        .then(existingStalker => {
          if (existingStalker) {
            // Update the 'allowed' field
            existingStalker.allowed = true;

            // Save the updated entry
            return existingStalker.save();
          } else {
            // Entry not found, handle the case accordingly
            console.log('Stalker entry not found');
            // You can create a new entry here if needed
          }
        })
        .then(updatedStalker => {
        
          
          // Reply to the victim
          interaction.reply(`You have allowed the user  <@${stalkerId}> to stalk you.`);
        })
        .catch(error => {
          console.error('Error updating stalker entry:', error);
        });
    }
  }
}
 // Replace './path/to/stalkerModel' with the actual path to your Mongoose model

// Import the Discord.js library if you haven't already




if (interaction.isButton() && interaction.customId === "deny") {
  const embeds = interaction.message.embeds;
  if (embeds.length > 0) {
    const description = embeds[0].description;
    const userIdRegex = /<@(\d+)>/;
    const userIdMatch = description.match(userIdRegex);
    if (userIdMatch) {
      const stalkerId = userIdMatch[1];
      const victimId = interaction.user.id;
      
      // Find the existing stalker entry in the database
      Stalker.findOne({ Stalker: stalkerId, Victim: victimId })
        .then(existingStalker => {
          if (existingStalker) {
            // Delete the stalker entry
            return existingStalker.delete();
          } else {
            // Entry not found, handle the case accordingly
            console.log('Stalker entry not found');
          }
        })
        .then(deletedStalker => {
          // Reply to the victim
          interaction.reply(`You have denied the user with ID <@${stalkerId}> from stalking you.`);

          // Send a DM to the stalker
            const stalkerDMContent = `Your request to stalk user <@${victimId}> has been denied.`;
           interaction.client.users.fetch(stalkerId)
            .then(stalkerUser => {
              stalkerUser.send(stalkerDMContent)
                .catch(error => console.error(`Error sending DM to stalker with ID ${stalkerId}:`, error));
            })
            .catch(error => {
              console.error(`Error fetching stalker user with ID ${stalkerId}:`, error);
            });
        })
        .catch(error => {
          console.error('Error deleting stalker entry:', error);
        });
    }
  }
}



  if (interaction.isButton() && interaction.customId == "random") {
  const category = Math.floor(Math.random() * 2); // 0 = Truth, 1 = Dare
  let question;
  if (category === 0) {
    question = await TruthQuestion.aggregate([{ $sample: { size: 1 } }]);
  } else {
    question = await DareQuestion.aggregate([{ $sample: { size: 1 } }]);
  }

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
    .setDescription(`You chose random! Requested by ${interaction.user.toString()}.`)

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
 if (interaction.isButton() && interaction.customId == "reroll") {
  const userId = interaction.user.id;
  // find user in database
  Tod.findOne({ userId: userId }, (err, user) => {
    if (err) {
      return client.errNormal({
        error: 'An error occurred while finding the user in the database',
        type: 'editreply'
      }, interaction);
    } else if (!user) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL({ size: 1024 })
        })
        .setColor(client.config.colors.error)
        .setFooter({
          text: client.config.discord.footer,
          iconURL: client.user.avatarURL({ size: 1024 })
        })
        .setTimestamp()
        .setTitle('You are not enrolled!')
        .setDescription('You need to enroll before playing the game.');

      interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      Tod.aggregate([
        { $match: { guildId: interaction.guild.id } },
        { $sample: { size: 2 } }
      ], (err, data) => {
        if (err) {
          return client.errNormal({
            error: 'An error occurred while retrieving players for the TOD game',
            type: 'editreply'
          }, interaction);
        } else if (data.length < 2) {
          return client.errNormal({
            error: 'There are not enough players in the TOD game',
            type: 'editreply'
          }, interaction);
        } else {
          const [player1, player2] = data;
          const players = [player1.userId, player2.userId];
          const askerId = players[Math.floor(Math.random() * players.length)];
          const categories = ['truth', 'dare'];
          const categoryIndex = Math.floor(Math.random() * 2);
          const category = categories[categoryIndex];
          const asker = `<@${askerId}>`;
          const asked = players.filter(playerId => playerId !== askerId)[0];
          const askedName = `<@${asked}>`;
          const text = `${asker} asks ${askedName}: ${category} `
          const embed = new EmbedBuilder()
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
            .setTitle(`${category}`)
            .setDescription('Get Ready!')
            .addFields(
              { name: 'Task', value: text, inline: true }
            );

          // Build the button row
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('reroll')
                .setLabel('Reroll')
                .setStyle('1')
            );

          // Send the embed and button row to the channel
          interaction.channel.send({ embeds: [embed], components: [row] });
        }
      });
    }
  });
}
if (interaction.isButton() && interaction.customId == "qotd") {
  // Get the question from the interaction message
  const question = interaction.message.embeds[0].description;

  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId('myModal')
    .setTitle('QOTD');

  // Add components to modal

  // Create the text input components
  const answer = new TextInputBuilder()
    .setCustomId('Question of the Day')
    // The label is the prompt the user sees for this input
    .setLabel("What's your reply?")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(question);

  const firstActionRow = new ActionRowBuilder().addComponents(answer);

  // Add inputs to the modal
  modal.addComponents(firstActionRow);

  // Show the modal to the user
  await interaction.showModal(modal);
}

if (interaction.isModalSubmit() && interaction.customId == "myModal") {
  const answer = interaction.fields.getTextInputValue('Question of the Day');

  // Get the user ID of the replier
  const replierId = interaction.user.id;

  // Get the question from the modal parameters
  const question = interaction.message.components[0].components[0].placeholder;

  // Create the embed
  const embed = new EmbedBuilder()
    .setColor(client.config.colors.normal)
    .setDescription(`**Question:** ${question}\n\n**Answer:** ${answer}\n\nSubmitted by: <@${replierId}>`);

  // Send the embed to the channel where the interaction occurred
  await interaction.channel.send({ embeds: [embed] });

  await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
}



  



  // Reaction roles button
  if (interaction.isButton()) {
    var buttonID = interaction.customId.split("-");

    if (buttonID[0] == "reaction_button") {
      reactionSchema.findOne({ Message: interaction.message.id }, async (err, data) => {
        if (!data) return;

        const [roleid] = data.Roles[buttonID[1]];

        if (interaction.member.roles.cache.get(roleid)) {
          interaction.guild.members.cache.get(interaction.user.id).roles.remove(roleid).catch(error => { })

          interaction.reply({ content: `<@&${roleid}> was removed!`, ephemeral: true });
        }
        else {
          interaction.guild.members.cache.get(interaction.user.id).roles.add(roleid).catch(error => { })

          interaction.reply({ content: `<@&${roleid}> was added!`, ephemeral: true });
        }
      })
    }
  }

  // Reaction roles select
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == "reaction_select") {
      reactionSchema.findOne(
        { Message: interaction.message.id },
        async (err, data) => {
          if (!data) return;

          let roles = "";

          for (let i = 0; i < interaction.values.length; i++) {
            const [roleid] = data.Roles[interaction.values[i]];

            roles += `<@&${roleid}> `;

            if (interaction.member.roles.cache.get(roleid)) {
              interaction.guild.members.cache
                .get(interaction.user.id)
                .roles.remove(roleid)
                .catch((error) => { });
            } else {
              interaction.guild.members.cache
                .get(interaction.user.id)
                .roles.add(roleid)
                .catch((error) => { });
            }

            if ((i + 1) === interaction.values.length) {
              interaction.reply({
                content: `I have updated the following roles for you: ${roles}`,
                ephemeral: true,
              });
            }
          }
        }
      );
    }
  }
  // Tickets
  if (interaction.customId == "Bot_openticket") {
    return require(`${process.cwd()}/src/commands/tickets/create.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_closeticket") {
    return require(`${process.cwd()}/src/commands/tickets/close.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_claimTicket") {
    return require(`${process.cwd()}/src/commands/tickets/claim.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_transcriptTicket") {
    return require(`${process.cwd()}/src/commands/tickets/transcript.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_openTicket") {
    return require(`${process.cwd()}/src/commands/tickets/open.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_deleteTicket") {
    return require(`${process.cwd()}/src/commands/tickets/delete.js`)(client, interaction);
  }

  if (interaction.customId == "Bot_noticeTicket") {
    return require(`${process.cwd()}/src/commands/tickets/notice.js`)(client, interaction);
  }
}

