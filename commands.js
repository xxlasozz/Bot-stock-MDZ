const { SlashCommandBuilder } = require('discord.js');

module.exports = [

    // -------------------------
    // /stock
    // -------------------------
    new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Affiche le stock actuel'),

    // -------------------------
    // /recolte
    // -------------------------
    new SlashCommandBuilder()
        .setName('recolte')
        .setDescription('Enregistrer une récolte')
        .addStringOption(option =>
            option.setName('matiere')
                .setDescription('Matière récoltée')
                .setRequired(true)
                .addChoices(
                    { name: 'Fentanyl', value: 'Fentanyl' },
                    { name: 'Xylazine', value: 'Xylazine' },
                    { name: 'Belladone', value: 'Belladone' },
                    { name: 'Feuilles', value: 'Feuilles' },
                    { name: 'Acide Sulfurique', value: 'Acide Sulfurique' },
                    { name: 'Amanita Rouge', value: 'Amanita Rouge' },
                    { name: 'Amanita Vert', value: 'Amanita Vert' },
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité récoltée')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('personne')
                .setDescription('Qui a récolté ?')
                .setRequired(true)),

    // -------------------------
    // /maj
    // -------------------------
    new SlashCommandBuilder()
        .setName('maj')
        .setDescription('Met à jour une matière première ou un produit fini')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Nom de la matière ou du produit')
                .setRequired(true)
                .addChoices(
                    { name: 'Fentanyl', value: 'Fentanyl' },
                    { name: 'Xylazine', value: 'Xylazine' },
                    { name: 'Belladone', value: 'Belladone' },
                    { name: 'Feuilles', value: 'Feuilles' },
                    { name: 'Acide Sulfurique', value: 'Acide Sulfurique' },
                    { name: 'Amanita Rouge', value: 'Amanita Rouge' },
                    { name: 'Amanita Vert', value: 'Amanita Vert' },

                    // Produits finis
                    { name: 'Tranq', value: 'Tranq' },
                    { name: 'Cocaïne', value: 'Cocaïne' },
                    { name: 'Mexicana', value: 'Mexicana' },
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité à ajouter ou retirer')
                .setRequired(true)),

    // -------------------------
    // /labo
    // -------------------------
    new SlashCommandBuilder()
        .setName('labo')
        .setDescription('Enregistrer une production labo')
        .addStringOption(option =>
            option.setName('produit')
                .setDescription('Produit fabriqué')
                .setRequired(true)
                .addChoices(
                    { name: 'Tranq', value: 'Tranq' },
                    { name: 'Cocaïne', value: 'Cocaïne' },
                    { name: 'Mexicana', value: 'Mexicana' },
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité produite')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('participants')
                .setDescription('Mentions des participants')
                .setRequired(true)),

    // -------------------------
    // /quota
    // -------------------------
    new SlashCommandBuilder()
        .setName('quota')
        .setDescription('Affiche le quota d’un membre')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Membre à analyser')
                .setRequired(true)),

    // -------------------------
    // /allcompta
    // -------------------------
    new SlashCommandBuilder()
        .setName('allcompta')
        .setDescription('Affiche la compta globale du serveur'),

    // -------------------------
    // /transac
    // -------------------------
    new SlashCommandBuilder()
        .setName('transac')
        .setDescription('Enregistrer une transaction')
        .addStringOption(option =>
            option.setName('produit')
                .setDescription('Produit vendu')
                .setRequired(true)
                .addChoices(
                    { name: 'Tranq', value: 'Tranq' },
                    { name: 'Cocaïne', value: 'Cocaïne' },
                    { name: 'Mexicana', value: 'Mexicana' },
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité vendue')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('groupe')
                .setDescription('Nom du groupe acheteur')
                .setRequired(true)),

    // -------------------------
    // /nukecompta
    // -------------------------
    new SlashCommandBuilder()
        .setName('nukecompta')
        .setDescription('Réinitialise toute la compta (récoltes + labos)'),
];
