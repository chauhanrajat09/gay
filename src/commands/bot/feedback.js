const Discord = require('discord.js');

const webhookClient = new Discord.WebhookClient({
    id: "1093059832648585296",
    token: "fMlDp3a90vN41KK39w8OSuwwf3jIUcV8ctyFLx9lg_LUKgY8F3ZWiyS11yT2s8cTvfaR",
});

module.exports = async (client, interaction, args) => {
    const feedback = interaction.options.getString('feedback');

    const embed = new Discord.EmbedBuilder()
        .setTitle(`📝・New feedback!`)
        .addFields(
            { name: "User", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
        )
        .setDescription(`${feedback}`)
        .setColor(client.config.colors.normal)
    webhookClient.send({
        username: 'Bot Feedback',
        embeds: [embed],
    });

    client.succNormal({ 
        text: `Feedback successfully sent to the developers`,
        type: 'editreply'
    }, interaction);
}

 