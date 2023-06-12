const Tod = require('../../database/models/tod');
const Antakshari = require('../../database/models/antakshari');
module.exports = async (client, interaction, args) => {
    const game = args[0].value;
    let GameModel;

    if (game === '123') { // TruthorDare
        GameModel = Tod;
    } else if (game === '12') { // Antakshari
        GameModel = Antakshari;
    } else {
        return client.errNormal({
            error: `Invalid game option: ${game}`,
            type: 'editreply'
        }, interaction);
    }

    const rawboard = await GameModel.find({ guildId: interaction.guild.id })

    if (rawboard.length < 1) return client.errNormal({ 
        error: `No data found for ${game} game!`,
        type: 'editreply'
    }, interaction);

    const lb = rawboard.map(e => `<@!${e.userId}> `);

    await client.createLeaderboard(`:game_die: ${game === '123' ? 'Truth or Dare' : 'Antakshari'} players - ${interaction.guild.name}`, lb, interaction);
}
