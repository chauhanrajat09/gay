const Discord = require('discord.js');
const Schema = require('../../database/models/language');

module.exports = async (client, interaction, args) => {
    const language = interaction.options.getString('language');
    const channel = interaction.options.getChannel('channel');

    console.log(`Received language ${language} and channel ${channel} from interaction`);

    // Save language and channel to the database for this guild
    new Schema({
        Channel: channel,
        language: language,
    }).save().then(() => {
        console.log(`Saved language ${language} and channel ${channel} to database`);
    }).catch(err => {
        console.error(`Error saving language ${language} and channel ${channel} to database: ${err}`);
    });

    // Send a confirmation message in the specified channel
    if (channel) {
        channel.send(`${language} is banned for this server`).then(() => {
            console.log(`Sent confirmation message to channel ${channel}`);
        }).catch(err => {
            console.error(`Error sending confirmation message to channel ${channel}: ${err}`);
        });
    }
        client.succNormal({
            title: `${language} has been banned from ${channel}`,
            type: 'editreply'
        }, interaction);
        console.log(`Sent confirmation message to interaction channel`);
    
}
