const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const TAGS = ["ᖇᏀᑎㅹ", "ᖇᏀ²ㅹ"];

    // Garante estrutura
    if (!context.esperandoNick) context.esperandoNick = {};
    if (!context.escolhendoTag) context.escolhendoTag = {};
    if (!context.nickTemp) context.nickTemp = {};

    const userId = message.author.id;

    // Iniciar comando
    if (message.content === "!nick") {
        context.esperandoNick[userId] = true;
        return message.reply("✏️ Escreva o seu nickname desejado. (Observação: Não escreva com tag).");
    }

    // Etapa 1: receber nickname
    if (context.esperandoNick[userId]) {
        const novoNick = message.content.trim();
        const maxLength = 32 - (TAGS[0].length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength)
            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("❌ Nickname inválido.");

        // Salva nickname
        context.nickTemp[userId] = novoNick;

        // Troca estado
        delete context.esperandoNick[userId];
        context.escolhendoTag[userId] = true;

        return message.reply(
            `🏷️ Escolha a TAG:\n` +
            `1️⃣ ${TAGS[0]}\n` +
            `2️⃣ ${TAGS[1]}\n\n` +
            `Digite **1** ou **2**`
        );
    }

    // Etapa 2: escolher tag
    if (context.escolhendoTag[userId]) {
        const escolha = message.content.trim();
        const nickBase = context.nickTemp[userId];

        if (!["1", "2"].includes(escolha))
            return message.reply("❌ Escolha inválida. Digite **1** ou **2**.");

        const TAG = TAGS[Number(escolha) - 1];

        try {
            const nickFinal = `${TAG} ${nickBase}`;

            await message.member.setNickname(nickFinal);

            // Limpeza
            delete context.escolhendoTag[userId];
            delete context.nickTemp[userId];

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });

        } catch (err) {
            delete context.escolhendoTag[userId];
            delete context.nickTemp[userId];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
        }
    }
};