const { PermissionsBitField } = require("discord.js");
const DataManager = require("../utils/DataManager"); // ajuste o caminho conforme sua pasta

module.exports = {
    name: "setban",
    description: "Define o canal para logs de ban",
    run: async (message, args) => {
        // Verifica se o autor é administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ Você precisa ser administrador para usar este comando.");
        }

        // Pega o canal marcado ou o ID fornecido
        const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!canal) {
            return message.reply("❌ Marque um canal válido ou passe o ID do canal.");
        }

        // Salva no DataManager e no banco de dados
        DataManager.canalBan = canal.id;
        await DataManager.salvarDados();

        return message.reply(`✅ Canal de ban definido para ${canal}`);
    }
};