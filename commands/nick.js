const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {

    // Garantir estrutura de estado
    if (!context.fluxoNick) context.fluxoNick = {};

    const userState = context.fluxoNick[message.author.id] || {};

    // Opcões de tag com suporte prw adicionar mais no futuro
    const TAGS = {
        "1": "ᖇᏀᑎㅹ",
        "2": "ᖇᏀᑎ²ㅹ"
    };

    // Iniciar comando pergutando sobre a tag
    if (message.content === "!nick") {

        context.fluxoNick[message.author.id] = {
            escolhendoTag: true
        };

        return message.reply(
            "🏷️ Escolha sua tag:\n\n1️⃣ ᖇᏀᑎㅹ\n2️⃣ ᖇᏀᑎ²ㅹ\n\nDigite apenas o número."
        );
        return true;
    }

    // Escolher TAG Aqui
    if (userState.escolhendoTag) {

        const escolha = message.content.trim();

        if (!TAGS[escolha]) {

            return message.reply("❌ Opção inválida. Digite 1 ou 2.");
            return true;
        }


        context.fluxoNick[message.author.id] = {
            esperandoNick: true,
            tagEscolhida: TAGS[escolha]
        };

        return message.reply("✏️ Agora escreva o seu nickname desejado.");
        return true;
    }

    // Definir nickname
    if (userState.esperandoNick) {

        const novoNick = message.content.trim();

        const TAG = userState.tagEscolhida || "ᖇᏀᑎㅹ";

        const maxLength = 32 - (TAG.length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength) {

            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);
            return true;
        }

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg")) {

            return message.reply("❌ Nickname inválido.");
            return true;
        }

        try {
            let nickLimpo = novoNick;

            if (nickLimpo.startsWith(TAG)) {
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;

            await message.member.setNickname(nickFinal);

            delete context.fluxoNick[message.author.id];

            console.log("[SUCESSO] Nickname alterado com sucesso");

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });
            return true;

        } catch (err) {

            delete context.fluxoNick[message.author.id];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
            return true;
        }
    }
};