const { PermissionsBitField } = require("discord.js");

module.exports = async (message, context) => {
    const prefix = "!";

    if (!message.content.startsWith(prefix + "setban")) return;

    // Apaga comando
    if (message.deletable) {
        await message.delete().catch(() => null);
    }

    // Permissão
    if (!message.member?.permissions?.has(PermissionsBitField.Flags.Administrator)) {
        return;
    }

    const args = message.content.slice(prefix.length + 6).trim().split(/ +/);

    const canal =
        message.mentions.channels.first() ||
        await message.guild.channels.fetch(args[0]).catch(() => null);

    if (!canal || !canal.isTextBased()) {
        return;
    }

    // 🔥 AQUI ESTÁ A CORREÇÃO REAL
    context.canalBan = canal.id;

    try {
        await context.salvarDados();

        console.log("✅ CANAL BAN SALVO NO MONGO:", context.canalBan);

    } catch (err) {
        console.error("❌ ERRO AO SALVAR CANAL BAN NO MONGO:", err);
        return;
    }

    // Feedback curto
    const msg = await message.channel.send(`✅ Canal de ban definido para ${canal}`);
    setTimeout(() => msg.delete().catch(() => null), 4000);
};