const Discord = require('discord.js');

const Schema = require("../../database/models/reactionRoles");

module.exports = async (client, interaction, args) => {
    const category = interaction.options.getString('category');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const lower = category.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substring(1);

    Schema.findOne({ Guild: interaction.guild.id, Category: category }, async (err, data) => {
        if (!data) return client.errNormal({ 
            error: `No data found!`,
            type: 'editreply'
        }, interaction);

        const map = Object.keys(data.Roles)
            .map((value, index) => {
                const role = interaction.guild.roles.cache.get(data.Roles[value][0]);

                return `${data.Roles[value][1].raw} | ${role}`;
            }).join("\n");

        const menu = new Discord.StringSelectMenuBuilder()
            .setCustomId('reaction_select')
            .setPlaceholder('❌┇Nothing selected')
            .setMinValues(1)

        var labels = [];

        const mapped = Object.keys(data.Roles).map((value, index) => {
            const role = interaction.guild.roles.cache.get(data.Roles[value][0]);

            const generated = {
                label: `${role.name}`,
                description: `Add or remove the role ${role.name}`,
               
                value: data.Roles[value][1].raw,
            }

            return labels.push(generated);
        }).join("\n");

        await menu.addOptions(labels);

        const row = new Discord.ActionRowBuilder()
            .addComponents(menu)

        client.embed({
            title: `${upper}・Roles`,
            desc: `_____ \n\nChoose your roles in the menu! \n\n${map}`,
            components: [row]
        }, channel).then((msg) => {
            data.Message = msg.id;
            data.save();
        })

        client.succNormal({ 
            text: "Reaction panel successfully created!",
            type: 'ephemeraledit'
        }, interaction);
    })
}

 