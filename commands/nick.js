const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const TAGS = {
        "1": "ᖇᏀᑎㅹ",
        "2": "ᖇᏀ²ㅹ"
    };

    // Inicialização segura
    context.nickTemp = context.nickTemp || {};
    context.esperandoNick = context.esperandoNick || null;
    context.esperandoTag = context.esperandoTag || null;

    // 1. Iniciar comando
    if (message.content === "!nick") {
        context.esperandoNick = message.author.id;
        return message.reply("✏️ Escreva o seu nickname desejado.");
    }

    // 2. Receber nickname
    if (context.esperandoNick === message.author.id) {
        const novoNick = message.content.trim();

        // validação básica sem TAG ainda
        if (novoNick.length < 2 || novoNick.length > 20)
            return message.reply("❌ O nickname deve ter entre 2 e 20 caracteres.");

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("❌ Nickname inválido.");

        // salvar temporariamente
        context.nickTemp[message.author.id] = novoNick;

        context.esperandoNick = null;
        context.esperandoTag = message.author.id;

        return message.reply(
            "🏷️ Escolha sua TAG:\n\n1 - ᖇᏀᑎㅹ\n2 - ᖇᏀ²ㅹ"
        );
    }

    // 3. Receber escolha da TAG
    if (context.esperandoTag === message.author.id) {
        const escolha = message.content.trim();
        const TAG = TAGS[escolha];

        if (!TAG)
            return message.reply("❌ Escolha inválida. Digite 1 ou 2.");

        let nickBase = context.nickTemp[message.author.id];

        // calcula limite real baseado na TAG escolhida
        const maxLength = 32 - (TAG.length + 1);

        if (nickBase.length > maxLength)
            return message.reply(`❌ Seu nick é muito grande para essa TAG. Máx: ${maxLength} caracteres.`);

        // remove TAG caso o usuário tenha digitado manualmente
        if (nickBase.startsWith(TAG)) {
            nickBase = nickBase.replace(TAG, "").trim();
        }

        const nickFinal = `${TAG} ${nickBase}`;

        try {
            await message.member.setNickname(nickFinal);

            // limpar estados
            context.esperandoTag = null;
            delete context.nickTemp[message.author.id];

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });
        } catch (err) {
            context.esperandoTag = null;
            delete context.nickTemp[message.author.id];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
        }
    }
};