const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const { esperandoNick, escolhendoTag } = context;

    // Opcões de tag com suporte pra adicionar mais no futuro
    const TAGS = {
        "1": "ᖇᏀᑎㅹ",
        "2": "ᖇᏀ²ㅹ"
    };

    // Iniciar comando perguntando sobre a tag
    if (message.content === "!nick") {
        context.escolhendoTag = message.author.id;

        message.reply(
            "🏷️ Escolha sua tag:\n\n1️⃣ ᖇᏀᑎㅹ\n2️⃣ ᖇᏀ²ㅹ\n\nDigite apenas o número."
        );
        return true;
    }

    // Escolher TAG Aqui
    if (context.escolhendoTag === message.author.id) {
        const escolha = message.content.trim();

        if (!TAGS[escolha]) {
            message.reply("❌ Opção inválida. Digite 1 ou 2.");
            return true;
        }

        context.tagEscolhida = TAGS[escolha];
        context.escolhendoTag = null;
        context.esperandoNick = message.author.id;

        message.reply("✏️ Agora escreva o seu nickname desejado.");
        return true;
    }

    // Definir nickname
    if (context.esperandoNick === message.author.id) {
        const novoNick = message.content.trim();
        const TAG = context.tagEscolhida || "ᖇᏀᑎㅹ";

        const maxLength = 32 - (TAG.length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength) {
            message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);
            return true;
        }

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg")) {
            message.reply("❌ Nickname inválido.");
            return true;
        }

        try {
            let nickLimpo = novoNick;

            if (nickLimpo.startsWith(TAG)) {
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;

            await message.member.setNickname(nickFinal);

            context.esperandoNick = null;
            context.tagEscolhida = null;

            message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });
            return true;

        } catch (err) {
            context.esperandoNick = null;
            context.tagEscolhida = null;

            message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
            return true;
        }
    }

    return false;
};