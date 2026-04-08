const { PermissionsBitField } = require("discord.js");

module.exports = async (message, context) => {
    const prefix = "!";

    // Verifica comando
    if (!message.content.startsWith(prefix + "setban")) return;

    // Permissão
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ Você precisa ser administrador para usar este comando.");
    }

    // Pega argumento (menção ou ID)
    const args = message.content.slice(prefix.length + 6).trim().split(/ +/);
    const canal =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

    if (!canal) {
        return message.reply("❌ Marque um canal válido ou informe o ID.");
    }

    // Salva no contexto correto
    context.canalBan = canal.id;

    // Salva no banco corretamente
    await context.salvarDados();

    console.log("✅ Canal de ban salvo:", context.canalBan);

    return message.reply(`✅ Canal de ban definido para ${canal}`);
};