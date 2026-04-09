const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    console.log("[INIT] Mensagem recebida:", message.content, "| Autor:", message.author.id);

    // Garantir estrutura de estado
    if (!context.fluxoNick) context.fluxoNick = {};

    const userState = context.fluxoNick[message.author.id] || {};

    // Opcões de tag com suporte prw adicionar mais no futuro
    const TAGS = {
        "1": "ᖇᏀᑎㅹ",
        "2": "ᖇᏀ²ㅹ"
    };

    // Iniciar comando pergutando sobre a tag
    if (message.content === "!nick") {
        console.log("[ETAPA] Iniciando escolha de TAG");

        context.fluxoNick[message.author.id] = {
            escolhendoTag: true
        };

        return message.reply(
            "🏷️ Escolha sua tag:\n\n1️⃣ ᖇᏀᑎㅹ\n2️⃣ ᖇᏀ²ㅹ\n\nDigite apenas o número."
        );
        return true;
    }

    // Escolher TAG Aqui
    if (userState.escolhendoTag) {
        console.log("[ETAPA] Usuário escolhendo TAG");

        const escolha = message.content.trim();
        console.log("[DADO] Escolha recebida:", escolha);

        if (!TAGS[escolha]) {
            console.log("[ERRO] Opção de TAG inválida");

            return message.reply("❌ Opção inválida. Digite 1 ou 2.");
            return true;
        }

        console.log("[SUCESSO] TAG escolhida:", TAGS[escolha]);

        context.fluxoNick[message.author.id] = {
            esperandoNick: true,
            tagEscolhida: TAGS[escolha]
        };

        return message.reply("✏️ Agora escreva o seu nickname desejado.");
        return true;
    }

    // Definir nickname
    if (userState.esperandoNick) {
        console.log("[ETAPA] Definindo nickname");

        const novoNick = message.content.trim();
        console.log("[DADO] Nick recebido:", novoNick);

        const TAG = userState.tagEscolhida || "ᖇᏀᑎㅹ";
        console.log("[DADO] TAG usada:", TAG);

        const maxLength = 32 - (TAG.length + 1);
        console.log("[DADO] Tamanho máximo permitido:", maxLength);

        if (novoNick.length < 2 || novoNick.length > maxLength) {
            console.log("[ERRO] Nick fora do tamanho permitido");

            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);
            return true;
        }

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg")) {
            console.log("[ERRO] Nick contém conteúdo proibido");

            return message.reply("❌ Nickname inválido.");
            return true;
        }

        try {
            let nickLimpo = novoNick;

            if (nickLimpo.startsWith(TAG)) {
                console.log("[INFO] Removendo TAG duplicada do nick");
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;
            console.log("[AÇÃO] Aplicando nickname:", nickFinal);

            await message.member.setNickname(nickFinal);

            delete context.fluxoNick[message.author.id];

            console.log("[SUCESSO] Nickname alterado com sucesso");

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });
            return true;

        } catch (err) {
            console.log("[ERRO] Falha ao alterar nickname:", err);

            delete context.fluxoNick[message.author.id];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
            return true;
        }
    }
};