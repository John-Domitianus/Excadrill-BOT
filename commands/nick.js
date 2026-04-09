const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message) => {
    const TAGS = ["ᖇᏀᑎㅹ", "ᖇᏀ²ㅹ"];

    if (message.content !== "!nick") return;

    const userId = message.author.id;

    await message.reply("> ✏️ Escreva o seu nickname desejado.");

    const filter = (m) => m.author.id === userId;

    const collector = message.channel.createMessageCollector({
        filter,
        max: 2,
        time: 60000
    });

    let etapa = 0;
    let nick = "";

    collector.on("collect", async (msg) => {
        // 🧩 ETAPA 1 - nickname
        if (etapa === 0) {
            const novoNick = msg.content.trim();
            const maxLength = 32 - (TAGS[0].length + 1);

            if (novoNick.length < 2 || novoNick.length > maxLength)
                return msg.reply(`> ❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);

            if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
                return msg.reply("> ❌ Nickname inválido.");

            nick = novoNick;
            etapa = 1;

            return msg.reply(
                `> 🏷️ Escolha a TAG:\n>\n` +
                `> 1️⃣ ${TAGS[0]}\n` +
                `> 2️⃣ ${TAGS[1]}\n>\n` +
                `> Digite **1** ou **2**`
            );
        }

        // 🧩 ETAPA 2 - escolha da tag
        if (etapa === 1) {
            const escolha = msg.content.trim();

            if (!["1", "2"].includes(escolha))
                return msg.reply("> ❌ Escolha inválida. Digite **1** ou **2**.");

            const TAG = TAGS[Number(escolha) - 1];
            const nickFinal = `${TAG} ${nick}`;

            try {
                await message.member.setNickname(nickFinal);

                collector.stop();

                return msg.reply({
                    embeds: [embedSucesso(`> ✅ Seu nickname foi alterado para:\n> **${nickFinal}**`)]
                });

            } catch (err) {
                collector.stop();

                return msg.reply({
                    embeds: [embedErro("> ❌ Não consegui alterar seu nickname.")]
                });
            }
        }
    });

    collector.on("end", (collected, reason) => {
        if (reason === "time") {
            message.reply("> ⏰ Tempo esgotado. Use `!nick` novamente.");
        }
    });
};