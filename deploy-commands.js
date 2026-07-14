require('dotenv').config();
const { REST, Routes } = require('discord.js');
const commands = require('./commands.js');


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Déploiement global…');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Commandes globales déployées ✔️');
    } catch (error) {
        console.error(error);
    }
})();
