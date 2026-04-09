const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const TAGS = ["ᖇᏀᑎㅹ", "ᖇᏀ²ㅹ"];
    const userId = message.author.id;

    if (!context.nickFlow) context.nickFlow = {};

    // Iniciar comando
    if (message.content === "!nick") {
        if (context.nickFlow[userId]) {
            return message.reply("> ⚠️ Você já está alterando seu nickname.");
        }

        context.nickFlow[userId] = { etapa: "nick" };

        return message.reply(
            "> ✏️ Escreva o seu nickname desejado.\n" +
            "> ⚠️ Não inclua TAG no nome."
        );
    }

    if (!context.nickFlow[userId]) return;

    const flow = context.nickFlow[userId];

    // ETAPA 1 - nickname
    if (flow.etapa === "nick") {
        const novoNick = message.content.trim();
        const maxLength = 32 - (TAGS[0].length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength)
            return message.reply(`> ❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("> ❌ Nickname inválido.");

        flow.nick = novoNick;
        flow.etapa = "tag";

        const msg = await message.reply(
            `> 🏷️ Escolha a TAG reagindo abaixo:\n>\n` +
            `> 1️⃣ ${TAGS[0]}\n` +
            `> 2️⃣ ${TAGS[1]}`
        );

        await msg.react("1️⃣");
        await msg.react("2️⃣");

        const filter = (reaction, user) =>
            ["1️⃣", "2️⃣"].includes(reaction.emoji.name) && user.id === userId;

        msg.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] })
            .then(async (collected) => {
                msg.reactions.removeAll().catch(() => {});

                const reaction = collected.first();
                const escolha = reaction.emoji.name === "1️⃣" ? 0 : 1;

                const TAG = TAGS[escolha];
                const nickFinal = `${TAG} ${flow.nick}`;

                try {
                    await message.member.setNickname(nickFinal);

                    delete context.nickFlow[userId];

                    return message.reply({
                        embeds: [embedSucesso(`> ✅ Seu nickname foi alterado para:\n> **${nickFinal}**`)]
                    });

                } catch (err) {
                    delete context.nickFlow[userId];

                    return message.reply({
                        embeds: [embedErro("> ❌ Não consegui alterar seu nickname.\n> Verifique minhas permissões.")]
                    });
                }
            })
            .catch(() => {
                delete context.nickFlow[userId];
                return message.reply("> ⏰ Tempo esgotado. Use `!nick` novamente.");
            });
    }
};