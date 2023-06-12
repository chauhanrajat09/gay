const Discord = require('discord.js');

module.exports = async (client, guild, oldLevel, newLevel) => {
    const logsChannel = await client.getLogs(guild.id);
    if (!logsChannel) return;

    client.embed({
        title: `<a:server_boosting: 1113803823924912188>・New boost level`,
        desc: `This server has returned to a new boost level`,
        fields: [
            {
                name: `> Old level`,
                value: `- ${oldLevel}`
            },
            {
                name: `> New level`,
                value: `- ${newLevel}`
            }
        ]
    }, logsChannel).catch(() => { })
};