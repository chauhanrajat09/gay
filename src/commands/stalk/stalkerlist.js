const Discord = require('discord.js');
const Schema = require('../../database/models/stalker'); // Replace with appropriate database model

module.exports = async (client, interaction, args) => {
   const rawboard = await Schema.find({ Victim: interaction.user.id });

    if (rawboard.length < 1) return client.errNormal({ 
        error: "No data found!",
        type: 'editreply'
    }, interaction);

     const lb = rawboard.map(e => `<@${u.Stalker}>`);

     await client.createLeaderboard(`😶‍🌫️ - stalkers`, lb, interaction);
}