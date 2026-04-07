const { PermissionsBitField } = require("discord.js");
const DataManager = require("../utils/DataManager");

module.exports = {
    name: "setfilacompleta",
    description: "Define o canal da Fila Completa",
    run: async (message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Você precisa ser administrador.");
        }

        const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!canal) return message.reply("❌ Marque um canal válido ou passe o ID.");

        DataManager.canalFilaCompleta = canal.id;
        await DataManager.salvarDados();

        return message.reply(`✅ Canal da lista definido: ${canal}`);
    }
};