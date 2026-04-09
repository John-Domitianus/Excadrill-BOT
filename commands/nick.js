const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const TAGS = ["ᖇᏀᑎㅹ", "ᖇᏀ²ㅹ"];

    // Iniciar comando
    if (message.content === "!nick") {
        context.esperandoNick = message.author.id;
        context.nickTemp = {};
        return message.reply("✏️ Escreva o seu nickname desejado.");
    }

    // Etapa 1: receber nickname
    if (context.esperandoNick === message.author.id) {
        const novoNick = message.content.trim();
        const maxLength = 32 - (TAGS[0].length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength)
            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("❌ Nickname inválido.");

        // Salva nickname temporário
        context.nickTemp[message.author.id] = novoNick;

        // Muda estado para escolha da tag
        context.esperandoNick = null;
        context.escolhendoTag = message.author.id;

        return message.reply(
            `🏷️ Escolha a TAG:\n` +
            `1️⃣ ${TAGS[0]}\n` +
            `2️⃣ ${TAGS[1]}\n\n` +
            `Digite **1** ou **2**`
        );
    }

    // Etapa 2: escolher tag
    if (context.escolhendoTag === message.author.id) {
        const escolha = message.content.trim();
        const nickBase = context.nickTemp[message.author.id];

        if (!["1", "2"].includes(escolha))
            return message.reply("❌ Escolha inválida. Digite **1** ou **2**.");

        const TAG = TAGS[Number(escolha) - 1];

        try {
            let nickLimpo = nickBase;

            if (nickLimpo.startsWith(TAG)) {
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;

            await message.member.setNickname(nickFinal);

            // Limpa estados
            context.escolhendoTag = null;
            delete context.nickTemp[message.author.id];

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });

        } catch (err) {
            context.escolhendoTag = null;
            delete context.nickTemp[message.author.id];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
        }
    }
};