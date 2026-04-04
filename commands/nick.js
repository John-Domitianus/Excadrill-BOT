const { embedSucesso, embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const { esperandoNick, controleDiario } = context;

    // Iniciar comando !nick
    if (message.content === "!nick") {
        context.esperandoNick = message.author.id;
        return message.reply("✏️ Escreva o seu nickname desejado.");
    }

    // Alterar nickname
    if (context.esperandoNick === message.author.id) {
        const novoNick = message.content.trim();
        const TAG = "ᖇᏀᑎㅹ";
        const maxLength = 32 - (TAG.length + 1);

        if (novoNick.length < 2 || novoNick.length > maxLength)
            return message.reply(`❌ O nickname deve ter entre 2 e ${maxLength} caracteres.`);

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("❌ Nickname inválido.");

        try {
            let nickLimpo = novoNick;

            if (nickLimpo.startsWith(TAG)) {
                nickLimpo = nickLimpo.replace(TAG, "").trim();
            }

            const nickFinal = `${TAG} ${nickLimpo}`;

            await message.member.setNickname(nickFinal);

            context.esperandoNick = null;
            return message.reply({ embeds: [embedSucesso(`Seu nickname foi alterado para **${nickFinal}**.`)] });
        } catch (err) {
            context.esperandoNick = null;
            return message.reply({ embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")] });
        }
    }
};