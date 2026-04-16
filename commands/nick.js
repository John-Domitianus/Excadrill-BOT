const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {

    // Garantir estrutura
    if (!context.fluxoNick) context.fluxoNick = {};

    const userState = context.fluxoNick[message.author.id] || {};

    // TAGS disponíveis
    const TAGS = {
        "1": "ᖇᏀᑎㅹ",
        "2": "ᖇᏀᑎ²ㅹ"
    };

    // ================= INICIAR COMANDO =================
    if (message.content === "!nick") {

        const menu = new StringSelectMenuBuilder()
            .setCustomId("select_tag_nick")
            .setPlaceholder("Selecione sua TAG")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "ᖇᏀᑎㅹ",
                    value: "1"
                },
                {
                    label: "ᖇᏀᑎ²ㅹ",
                    value: "2"
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        return message.reply({
            content: "🏷️ Escolha sua tag:",
            components: [row]
        });
    }

    // ================= DEFINIR NICK =================
    if (userState.esperandoNick) {

        const novoNick = message.content.trim();
        const TAG = userState.tagEscolhida || "ᖇᏀᑎㅹ";

        const maxLength = 32 - (TAG.length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength) {
            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);
        }

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg")) {
            return message.reply("❌ Nickname inválido.");
        }

        try {
            let nickLimpo = novoNick;

            if (nickLimpo.startsWith(TAG)) {
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;

            const nickAntigo = message.member.displayName;

            await message.member.setNickname(nickFinal);

            delete context.fluxoNick[message.author.id];

            console.log(`Nickname alterado de "${nickAntigo}" para "${nickFinal}"`);

            return message.reply({
                embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)]
            });

        } catch (err) {

            delete context.fluxoNick[message.author.id];

            return message.reply({
                embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")]
            });
        }
    }
};