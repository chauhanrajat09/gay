const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: `📘・Owner information`,
        desc: `____________________________`,
        thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
        fields: [{
            name: "👑┆Owner name",
            value: `Rajat`,
            inline: true,
        },
        {
            name: "🏷┆Discord tag",
            value: `<@442710545804558356>`,
            inline: true,
        },
        {
            name: "🏢┆Organization",
            value: `VK`,
            inline: true,
        },
        {
            name: "🌐┆Website",
            value: `Banana Gay`,
            inline: true,
        }],
        type: 'editreply'
    }, interaction)
}

 