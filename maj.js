const fs = require('fs');

module.exports = {
    name: "maj",
    description: "Met à jour une matière première ou un produit fini",
    options: [
        {
            name: "item",
            description: "Nom de la matière ou du produit",
            type: 3,
            required: true
        },
        {
            name: "quantite",
            description: "Quantité à ajouter ou retirer",
            type: 4,
            required: true
        }
    ],

    async execute(interaction) {
        const item = interaction.options.getString("item").toLowerCase();
        const quantite = interaction.options.getInteger("quantite");

        let stock = JSON.parse(fs.readFileSync("stock.json", "utf8"));

        if (stock.matieres[item] !== undefined) {
            stock.matieres[item] += quantite;
            if (stock.matieres[item] < 0) stock.matieres[item] = 0;

            fs.writeFileSync("stock.json", JSON.stringify(stock, null, 2));
            return interaction.reply(`🔧 Mise à jour effectuée : **${item}** → ${stock.matieres[item]} unités`);
        }

        if (stock.produits[item] !== undefined) {
            stock.produits[item] += quantite;
            if (stock.produits[item] < 0) stock.produits[item] = 0;

            fs.writeFileSync("stock.json", JSON.stringify(stock, null, 2));
            return interaction.reply(`🍾 Mise à jour effectuée : **${item}** → ${stock.produits[item]} unités`);
        }

        return interaction.reply(`❌ L'item **${item}** n'existe pas dans le stock.`);
    }
};
