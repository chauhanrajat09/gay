const Discord = require('discord.js');
const Schema = require('../../database/models/afk');

module.exports = async (client, interaction, args) => {

    client.checkPerms({
        flags: [Discord.PermissionsBitField.ADMINISTRATOR],
        perms: [Discord.PermissionsBitField.ADMINISTRATOR]
    }, interaction);

    // Get the member to remove AFK status from
    const member = interaction.options.getMember('user');
    if (!member) {
        return client.errUsage({
            usage: 'no user provided',
            type: 'editreply'
        }, interaction);
    }

    // Find the AFK data for the specified user in the current guild
    const afkData = await Schema.findOne({ Guild: interaction.guild.id, User: member.user.id });
    if (!afkData) {
        return client.errNormal({
            error: `User not AFK!`,
            components: [],
            type: 'editreply'
        }, interaction);
    }

    // Remove the AFK data for the specified user in the current guild
    await Schema.findOneAndDelete({ Guild: interaction.guild.id, User: member.user.id });

    // Update the user's nickname to remove the AFK prefix
    if (member.displayName.startsWith(`[AFK] `)) {
        const newNickname = member.displayName.replace('[AFK] ', '');
        member.setNickname(newNickname).catch(console.error);
    }

    // Send a success message
    client.succNormal({
        text: 'AFK cleared!',
        type: 'editreply'
    }, interaction);
};
