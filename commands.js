const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Affiche le stock actuel'),

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
                ))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité récoltée')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('personne')
                .setDescription('Qui a récolté ?')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('maj')
        .setDescription('Met à jour une matière première ou un produit fini')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Nom de la matière ou du produit')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité à ajouter ou retirer')
                .setRequired(true)),
];
