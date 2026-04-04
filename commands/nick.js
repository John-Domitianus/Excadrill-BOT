const { embedSucesso, embedErro } = require("./utils/embeds");

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

        if (novoNick.length < 2 || novoNick.length > 32)
            return message.reply("❌ O nickname deve ter entre 2 e 32 caracteres.");

        if (novoNick.includes("@") || novoNick.toLowerCase().includes("discord.gg"))
            return message.reply("❌ Nickname inválido.");

        try {
            await message.member.setNickname(novoNick);
            context.esperandoNick = null;
            return message.reply({ embeds: [embedSucesso(`Seu nickname foi alterado para **${novoNick}**.`)] });
        } catch (err) {
            context.esperandoNick = null;
            return message.reply({ embeds: [embedErro("Não consegui alterar seu nickname. Verifique minhas permissões.")] });
        }
    }
};