const { PermissionsBitField } = require("discord.js");

module.exports = async (message, context) => {
    const prefix = "!";

    if (!message.content.startsWith(prefix + "setban")) return;

    if (message.deletable) await message.delete().catch(() => null);

    if (!message.member?.permissions?.has(PermissionsBitField.Flags.Administrator)) return;

    const args = message.content.slice(prefix.length + 6).trim().split(/ +/);

    const canal =
        message.mentions.channels.first() ||
        await message.guild.channels.fetch(args[0]).catch(() => null);

    if (!canal || typeof canal.isTextBased !== "function" || !canal.isTextBased()) return;

    // 🔥 Salva o canal de ban via contexto
    context.dataManager.setCanalBan(canal.id);

    try {
        await context.dataManager.salvarDados();
        console.log("✅ CANAL BAN SALVO:", canal.id);
    } catch (err) {
        console.error("❌ ERRO AO SALVAR:", err);
        return;
    }

    const msg = await message.channel.send(`✅ Canal de ban definido para ${canal}`);
    setTimeout(() => msg.delete().catch(() => null), 4000);
};