const { SlashCommandBuilder } = require('discord.js');
const maj = require('./commands/maj');


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
                    { name: 'Amanita Rouge', value: 'Amanita Rouge' },
                    { name: 'Amanita Vert', value: 'Amanita Vert' }
             )
                
        )

        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('personne')
                .setDescription('Personne')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('labo')
        .setDescription('Production labo')
        .addStringOption(option =>
            option.setName('produit')
                .setDescription('Produit fabriqué')
                .setRequired(true)
                .addChoices(
                    { name: 'Tranq', value: 'Tranq' },
                    { name: 'Cocaïne', value: 'Cocaïne' },
                    { name: 'Mexicana', value: 'Mexicana' }
                )
        )
        .addIntegerOption(option =>
            option.setName('quantite')
                .setDescription('Quantité')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('participants')
                .setDescription('Liste des participants')
                .setRequired(true)
        ),

        new SlashCommandBuilder()
    .setName('quota')
    .setDescription('Affiche le quota d’un membre')
    .addUserOption(option =>
        option.setName('membre')
            .setDescription('Membre du serveur')
            .setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName('allcompta')
    .setDescription('Affiche le quota de tous les membres du serveur'),

new SlashCommandBuilder()
    .setName('transac')
    .setDescription('Enregistrer une transaction de vente')
    .addStringOption(option =>
        option.setName('produit')
            .setDescription('Produit vendu')
            .setRequired(true)
            .addChoices(
                { name: 'Tranq', value: 'Tranq' },
                { name: 'Cocaïne', value: 'Cocaïne' },
                { name: 'Mexicana', value: 'Mexicana' }
            )
    )
    .addIntegerOption(option =>
        option.setName('quantite')
            .setDescription('Quantité vendue')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('groupe')
            .setDescription('Nom du groupe acheteur')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('nukecompta')
    .setDescription('Réinitialise toute la compta (récoltes + labos)'),

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
