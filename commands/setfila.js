const { PermissionsBitField } = require("discord.js");
const { canalFilaCompleta, salvarDados } = require("../services/dataManager"); // ajuste conforme sua pasta

module.exports = async (message, context) => {
    const prefix = "!"; // Prefixo padrão
    if (!message.content.startsWith(prefix + "setfila")) return;

    // Verifica permissão
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ Você precisa ser administrador.");
    }

    // Pega o canal marcado ou ID
    const args = message.content.slice(prefix.length + 16).trim().split(/ +/); // 16 = length de "setfilacompleta"
    const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!canal) return message.reply("❌ Marque um canal válido ou passe o ID do canal.");

    // Salva no DataManager
    context.canalFilaCompleta = canal.id;
    await salvarDados();

    return message.reply(`✅ Canal da lista definido: ${canal}`);
};