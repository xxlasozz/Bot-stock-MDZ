require('./dotenv.config');

console.log("TOKEN =", JSON.stringify(process.env.TOKEN));

const fs = require('fs');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// ----------------------
// FONCTIONS STOCK & COMPTA
// ----------------------
function loadStock() {
    return JSON.parse(fs.readFileSync('stock.json'));
}

function saveStock(stock) {
    fs.writeFileSync('stock.json', JSON.stringify(stock, null, 2));
}

function loadCompta() {
    return JSON.parse(fs.readFileSync('compta.json'));
}

function saveCompta(compta) {
    fs.writeFileSync('compta.json', JSON.stringify(compta, null, 2));
}

client.on('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// ----------------------
// LISTENER PRINCIPAL
// ----------------------
client.on('interactionCreate', async interaction => {

    // ----------------------
    // BOUTONS
    // ----------------------
    if (interaction.isButton()) {

        if (interaction.customId === 'nuke_confirm') {
            saveCompta([]);
            return interaction.update({
                content: "💥 COMPTA RÉINITIALISÉE !",
                components: []
            });
        }

        if (interaction.customId === 'nuke_cancel') {
            return interaction.update({
                content: "❎ Action annulée.",
                components: []
            });
        }

        return;
    }

    // ----------------------
    // COMMANDES SLASH
    // ----------------------
    if (!interaction.isChatInputCommand()) return;

    const stock = loadStock();
    const compta = loadCompta();

    // Rôle Madrazo X
    const roleMadrazo = interaction.guild.roles.cache.find(r => r.name === "Madrazo X");

    // ----------------------
    // /stock
    // ----------------------
    if (interaction.commandName === 'stock') {
        let msg = "**📦 STOCK ACTUEL :**\n\n";

        msg += "__Matières premières :__\n";
        msg += `Fentanyl : ${stock["Fentanyl"]}\n`;
        msg += `Xylazine : ${stock["Xylazine"]}\n`;
        msg += `Belladone : ${stock["Belladone"]}\n`;
        msg += `Feuilles : ${stock["Feuilles"]}\n`;
        msg += `Acide Sulfurique : ${stock["Acide Sulfurique"]}\n`;
        msg += `Amanita Rouge : ${stock["Amanita Rouge"]}\n`;
        msg += `Amanita Vert : ${stock["Amanita Vert"]}\n\n`;

        msg += "__Produits finis :__\n";
        msg += `Tranq : ${stock["Tranq"]}\n`;
        msg += `Cocaïne : ${stock["Cocaïne"]}\n`;
        msg += `Mexicana : ${stock["Mexicana"]}\n`;

        return interaction.reply(msg);
    }

    // ----------------------
    // /recolte
    // ----------------------
    if (interaction.commandName === 'recolte') {
        const matiere = interaction.options.getString('matiere');
        const quantite = interaction.options.getInteger('quantite');
        const personne = interaction.options.getUser('personne');

        const membreGuild = interaction.guild.members.cache.get(personne.id);

        // ❌ Seuls les Madrazo X sont comptés
        if (!roleMadrazo || !membreGuild.roles.cache.has(roleMadrazo.id)) {
            return interaction.reply("⛔ Ce membre n'est pas Madrazo X.");
        }

        stock[matiere] += quantite;
        saveStock(stock);

        compta.push({
            type: "recolte",
            matiere,
            quantite,
            user: personne.id,
            date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        });
        saveCompta(compta);

        return interaction.reply(
            `🌱 Récolte enregistrée :\n\n` +
            `• Matière : **${matiere}**\n` +
            `• Quantité : **${quantite}**\n` +
            `• Par : <@${personne.id}>\n\n` +
            `Stock mis à jour ✔️`
        );
    }

    // ----------------------
    // /maj
    // ----------------------
    if (interaction.commandName === 'maj') {
        const item = interaction.options.getString('item');
        const quantite = interaction.options.getInteger('quantite');

        if (stock[item] === undefined) {
            return interaction.reply(`❌ L'item **${item}** n'existe pas dans le stock.`);
        }

        stock[item] += quantite;
        if (stock[item] < 0) stock[item] = 0;

        saveStock(stock);

        return interaction.reply(
            `🔧 Mise à jour effectuée :\n\n` +
            `• Item : **${item}**\n` +
            `• Nouvelle quantité : **${stock[item]}**`
        );
    }

    // ----------------------
    // /labo
    // ----------------------
    if (interaction.commandName === 'labo') {
        const produit = interaction.options.getString('produit');
        const quantite = interaction.options.getInteger('quantite');
        const participantsRaw = interaction.options.getString('participants');

        const recettes = {
            "Tranq": { "Fentanyl": 2, "Xylazine": 2, "Belladone": 1 },
            "Cocaïne": { "Feuilles": 1, "Acide Sulfurique": 1 },
            "Mexicana": { "Amanita Rouge": 1, "Amanita Vert": 1 }
        };

        const req = recettes[produit];

        for (const matiere in req) {
            const totalNeeded = req[matiere] * quantite;
            if (stock[matiere] < totalNeeded) {
                return interaction.reply(
                    `❌ Stock insuffisant pour produire **${quantite} ${produit}**.\n` +
                    `Il manque : **${matiere}**`
                );
            }
        }

        const mentionRegex = /<@!?(\d+)>/g;
        const participants = [];
        let match;

        while ((match = mentionRegex.exec(participantsRaw)) !== null) {
            participants.push(match[1]);
        }

        if (participants.length === 0) {
    return interaction.reply(
        "❌ Aucun participant trouvé.\n" +
        "Utilise des **mentions**."
    );
}


        const membres = await interaction.guild.members.fetch();

        // ❌ Filtrer uniquement les Madrazo X
        const participantsFiltrés = participants.filter(id => {
            const m = membres.get(id);
            return roleMadrazo && m.roles.cache.has(roleMadrazo.id);
        });

        if (participantsFiltrés.length === 0) {
            return interaction.reply("⛔ Aucun participant Madrazo X trouvé.");
        }

        for (const matiere in req) {
            stock[matiere] -= req[matiere] * quantite;
        }

        stock[produit] += quantite;
        saveStock(stock);

        compta.push({
            type: "labo",
            produit,
            quantite,
            participants: participantsFiltrés,
            date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        });
        saveCompta(compta);

        return interaction.reply(
            `🧪 **Production labo enregistrée !**\n\n` +
            `• Produit : **${produit}**\n` +
            `• Quantité : **${quantite}**\n` +
            `• Participants : ${participantsFiltrés.map(id => `<@${id}>`).join(" ")}\n` +
            `• Heure : ${new Date().toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' })}\n\n` +
            `Stock mis à jour ✔️`
        );
    }

    // ----------------------
    // /quota
    // ----------------------
    if (interaction.commandName === 'quota') {
        const membre = interaction.options.getUser('membre');
        const m = interaction.guild.members.cache.get(membre.id);

        // ❌ Seuls les Madrazo X sont comptés
        if (!roleMadrazo || !m.roles.cache.has(roleMadrazo.id)) {
            return interaction.reply("⛔ Ce membre n'est pas Madrazo X.");
        }

        let recoltes = 0;
        let labos = 0;

        for (const entry of compta) {
            if (entry.type === "recolte" && entry.user === membre.id) {
                recoltes += entry.quantite;
            }

            if (entry.type === "labo" && entry.participants.includes(membre.id)) {
                labos++; // ✔ 1 labo = 1 action
            }
        }

        return interaction.reply(
            `📊 **Quota de ${membre.username}**\n\n` +
            `🌱 Récoltes : **${recoltes}**\n` +
            `🧪 Labos : **${labos}**`
        );
    }

    // ----------------------
    // /allcompta
    // ----------------------
    if (interaction.commandName === 'allcompta') {
        const membres = await interaction.guild.members.fetch();

        const quotas = {};

        membres.forEach(m => {
            if (m.user.bot) return;

            // ❌ Seuls les Madrazo X sont comptés
            if (!roleMadrazo || !m.roles.cache.has(roleMadrazo.id)) return;

            quotas[m.id] = { recoltes: 0, labos: 0 };
        });

        for (const entry of compta) {
            if (entry.type === "recolte") {
                const m = membres.get(entry.user);
                if (!m) continue;

                if (!roleMadrazo || !m.roles.cache.has(roleMadrazo.id)) continue;

                quotas[entry.user].recoltes += entry.quantite;
            }

            if (entry.type === "labo") {
                for (const participant of entry.participants) {
                    const m = membres.get(participant);
                    if (!m) continue;

                    if (!roleMadrazo || !m.roles.cache.has(roleMadrazo.id)) continue;

                    quotas[participant].labos++;
                }
            }
        }

        let msg = "📊 **Compta globale du serveur**\n\n";

        for (const [userId, data] of Object.entries(quotas)) {
            const user = membres.get(userId);
            if (!user) continue;

            msg += `👤 **${user.user.username}**\n`;
            msg += `🌱 Récoltes : ${data.recoltes}\n`;
            msg += `🧪 Labos : ${data.labos}\n\n`;
        }

        return interaction.reply(msg);
    }

    // ----------------------
    // /transac
    // ----------------------
    if (interaction.commandName === 'transac') {
        const produit = interaction.options.getString('produit');
        const quantite = interaction.options.getInteger('quantite');
        const groupe = interaction.options.getString('groupe');

        const prix = {
            "Tranq": 130,
            "Cocaïne": 320,
            "Mexicana": 210
        };

        const total = prix[produit] * quantite;

        compta.push({
            type: "transac",
            produit,
            quantite,
            groupe,
            total,
            date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
        });
        saveCompta(compta);

        return interaction.reply(
            `💰 **Transaction enregistrée !**\n\n` +
            `• Produit : **${produit}**\n` +
            `• Quantité : **${quantite}**\n` +
            `• Groupe acheteur : **${groupe}**\n` +
            `• Prix unitaire : **${prix[produit]}$**\n` +
            `• Total : **${total}$**\n\n` +
            `Stock mis à jour ✔️`
        );
    }

    // ----------------------
    // /nukecompta
    // ----------------------
    if (interaction.commandName === 'nukecompta') {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nuke_confirm')
                    .setLabel('NUKE')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('nuke_cancel')
                    .setLabel('Annuler')
                    .setStyle(ButtonStyle.Secondary)
            );

        return interaction.reply({
            content: "⚠️ **ATTENTION : Cette action va réinitialiser TOUTE la compta.**\n\n" +
                     "Cela supprimera :\n" +
                     "• Toutes les récoltes\n" +
                     "• Tous les labos\n\n" +
                     "Confirme uniquement si tu es sûr.",
            components: [row]
        });
    }

});

// ----------------------
// LOGIN
// ----------------------
console.log("TOKEN =", process.env.TOKEN);
client.login(process.env.TOKEN);
