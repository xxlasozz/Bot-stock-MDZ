require('./dotenv.config');

console.log("TOKEN =", JSON.stringify(process.env.TOKEN));

const fs = require('fs');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const stock = require('./commands/stock');
const recolte = require('./commands/recolte');
const maj = require('./commands/maj');

const commands = new Map();


commands.set(stock.name, stock);
commands.set(recolte.name, recolte);
commands.set(maj.name, maj);


const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel]
});

// ----------------------
// LISTENER COMMANDES SLASH
// ----------------------
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // 👉 Ici tu mets :
    // /stock
    // /recolte
    // /labo
    // /quota
    // /allcompta
    // /transac
    // /nukecompta
});


// ----------------------
// LISTENER BOUTONS
// ----------------------
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

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
});

// Chargement du stock


function loadStock() {
    return JSON.parse(fs.readFileSync('stock.json'));
}

// Sauvegarde du stock
function saveStock(stock) {
    fs.writeFileSync('stock.json', JSON.stringify(stock, null, 2));
}

// Chargement compta
function loadCompta() {
    return JSON.parse(fs.readFileSync('compta.json'));
}

// Sauvegarde compta
function saveCompta(compta) {
    fs.writeFileSync('compta.json', JSON.stringify(compta, null, 2));
}

client.on('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const stock = loadStock();
    const compta = loadCompta();

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

    if (interaction.commandName === 'recolte') {
        const matiere = interaction.options.getString('matiere');
        const quantite = interaction.options.getInteger('quantite');
        const personne = interaction.options.getUser('personne');

        stock[matiere] += quantite;
        saveStock(stock);

        compta.push({
            type: "recolte",
            matiere,
            quantite,
            user: personne.id,
            date: new Date().toISOString()
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

    if (interaction.commandName === 'labo') {
    const produit = interaction.options.getString('produit');
    const quantite = interaction.options.getInteger('quantite');
    const participantsRaw = interaction.options.getString('participants');

    const stock = loadStock();
    const compta = loadCompta();

    const recettes = {
        "Tranq": { "Fentanyl": 2, "Xylazine": 2, "Belladone": 1 },
        "Cocaïne": { "Feuilles": 1, "Aciide Sulfurique": 1 },
        "Mexicana": { "Amanita Rouge": 1, "Amanita Vert": 1 }
    };

    const req = recettes[produit];

    // Vérif stock
    for (const matiere in req) {
        const totalNeeded = req[matiere] * quantite;
        if (stock[matiere] < totalNeeded) {
            return interaction.reply(
                `❌ Stock insuffisant pour produire **${quantite} ${produit}**.\n` +
                `Il manque : **${matiere}**`
            );
        }
    }

    // Extraction des IDs depuis les mentions
    const mentionRegex = /<@!?(\d+)>/g;
    const participants = [];
    let match;

    while ((match = mentionRegex.exec(participantsRaw)) !== null) {
        participants.push(match[1]); // match[1] = ID
    }

    if (participants.length === 0) {
        return interaction.reply(
            "❌ Aucun participant trouvé dans le serveur.\n" +
            "Utilise des **mentions** dans le champ participants (ex: @Marine @La)."
        );
    }

    // Déduction du stock
    for (const matiere in req) {
        stock[matiere] -= req[matiere] * quantite;
    }

    stock[produit] += quantite;
    saveStock(stock);

    // Enregistrement compta
    compta.push({
        type: "labo",
        produit,
        quantite,
        participants, // IDs Discord
        date: new Date().toISOString()
    });
    saveCompta(compta);

    return interaction.reply(
        `🧪 **Production labo enregistrée !**\n\n` +
        `• Produit : **${produit}**\n` +
        `• Quantité : **${quantite}**\n` +
        `• Participants : ${participantsRaw}\n` +
        `• Heure : ${new Date().toLocaleTimeString()}\n\n` +
        `Stock mis à jour ✔️`
    );
}



if (interaction.commandName === 'quota') {
    const membre = interaction.options.getUser('membre');
    const compta = loadCompta();

    let recoltes = 0;
    let labos = 0;

    for (const entry of compta) {
        if (entry.type === "recolte" && entry.user === membre.id) {
            recoltes++;
        }

        if (entry.type === "labo" && entry.participants.includes(membre.id)) {
            labos++;
        }
    }

    return interaction.reply(
        `📊 **Quota de ${membre.username}**\n\n` +
        `🌱 Récoltes : **${recoltes}**\n` +
        `🧪 Labos : **${labos}**`
    );
}

if (interaction.commandName === 'allcompta') {
    const compta = loadCompta();
    const membres = interaction.guild.members.cache;

    // Structure : { userId: { recoltes: X, labos: Y } }
    const quotas = {};

    // Initialisation : tous les membres du serveur
    membres.forEach(m => {
        if (m.user.bot) return; // ⬅️ empêche le bot d'apparaître
        quotas[m.id] = { recoltes: 0, labos: 0 };
    });

    // Comptage
    for (const entry of compta) {
        if (entry.type === "recolte") {
            if (!quotas[entry.user]) quotas[entry.user] = { recoltes: 0, labos: 0 };
            quotas[entry.user].recoltes++;
        }

        if (entry.type === "labo") {
            for (const participant of entry.participants) {
                if (!quotas[participant]) quotas[participant] = { recoltes: 0, labos: 0 };
                quotas[participant].labos++;
            }
        }
    }

    // Construction du message
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

if (interaction.commandName === 'transac') {
    const produit = interaction.options.getString('produit');
    const quantite = interaction.options.getInteger('quantite');
    const groupe = interaction.options.getString('groupe');

    const stock = loadStock();
    const compta = loadCompta();

    // Prix unitaires
    const prix = {
        "Tranq": 110,
        "Cocaïne": 320,
        "Mexicana": 210
    };

    // Vérification stock
    if (stock[produit] < quantite) {
        return interaction.reply(
            `❌ Stock insuffisant pour vendre **${quantite} ${produit}**.\n` +
            `Stock actuel : **${stock[produit]}**`
        );
    }

    // Déduction du stock
    stock[produit] -= quantite;
    saveStock(stock);

    // Calcul prix total
    const total = prix[produit] * quantite;

    // Enregistrement compta
    compta.push({
        type: "transac",
        produit,
        quantite,
        groupe,
        total,
        date: new Date().toISOString()
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
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'nuke_confirm') {
        saveCompta([]); // reset complet
        return interaction.update({
            content: "💥 **COMPTA RÉINITIALISÉE !**\nToutes les récoltes et labos ont été supprimés.",
            components: []
        });
    }

    if (interaction.customId === 'nuke_cancel') {
        return interaction.update({
            content: "❎ Action annulée. Rien n’a été supprimé.",
            components: []
        });
    }
});


});
console.log("TOKEN =", process.env.TOKEN);

client.login(process.env.TOKEN);
