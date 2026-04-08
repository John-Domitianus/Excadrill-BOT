const { PermissionsBitField } = require("discord.js");
const { canalBan, salvarDados } = require("../services/dataManager");

module.exports = async (message, context) => {
    const prefix = "!"; // prefixo padrão
    if (!message.content.startsWith(prefix + "setban")) return;

    // Verifica permissão
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ Você precisa ser administrador para usar este comando.");
    }

    // Pega o canal marcado ou ID
    const args = message.content.slice(prefix.length + 6).trim().split(/ +/);
    const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!canal) return message.reply("❌ Marque um canal válido ou passe o ID do canal.");
    console.log("Canal salvo:", context.canalBan);

    // Salva no dataManager
    context.canalBan = canal.id;
    await salvarDados();

    return message.reply(`✅ Canal de ban definido para ${canal}`);
};