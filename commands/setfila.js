const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const dataManager = require("../utils/datamanager"); // ajuste caminho conforme seu projeto

module.exports = async (message) => {
    const prefix = "!";
    if (!message.content.startsWith(prefix + "setfila")) return;

    if (message.deletable) await message.delete().catch(() => null);

    if (!message.member?.permissions?.has(PermissionsBitField.Flags.Administrator)) return;

    const args = message.content.slice(prefix.length + 7).trim().split(/ +/);

    // Pega o canal por menção ou ID; se nada, usa o canal atual
    const canal =
        message.mentions.channels.first() ||
        await message.guild.channels.fetch(args[0]).catch(() => null) ||
        message.channel;

    if (!canal || !canal.isTextBased()) return;

    // 🔥 Salva o canal no dataManager
    dataManager.setCanalFila(canal.id);

    // Cria a mensagem inicial para servir como âncora
    try {
        const mensagemLista = await canal.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle("📋 Lista Oficial - Filas Makyo")
                    .setDescription("A lista será atualizada automaticamente.")
            ]
        });
        dataManager.setMensagemFila(mensagemLista.id); // salva o ID da mensagem
        await dataManager.salvarDados();

        console.log("✅ Canal e mensagem da lista inicial criados:", canal.id, mensagemLista.id);
    } catch (err) {
        console.error("❌ ERRO AO CRIAR MENSAGEM INICIAL:", err);
        return;
    }

    const msg = await message.channel.send(`✅ Canal da lista Makyo definido para ${canal}`);
    setTimeout(() => msg.delete().catch(() => null), 4000);
};