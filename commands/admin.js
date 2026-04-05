const { embedErro } = require("../utils/embeds");
const { PermissionsBitField } = require("discord.js");

module.exports = async (message, context) => {
    if (message.content !== "!admin") return;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    return message.reply({
        embeds: [
            {
                color: 0xFAA61A,
                title: "🛠️ Painel Admin",
                description: "Aqui você tem controle total sobre os painéis de Makyo, Guerra e Moderação. Use os botões abaixo para gerenciar filas, resetar filas e gerenciar penalidades.",
                fields: [
                    { name: "Makyo", value: "Acesse o painel de administração do Makyo para resetar filas, banir/desbanir jogadores.", inline: true },
                    { name: "Guerra", value: "Acesse o painel de administração da Guerra para limpar titulares/reservas e remover jogadores.", inline: true },
                    { name: "Moderação", value: "Acesse o painel de administração da Moderação para banir jogadores ou gerenciar a Blacklist.", inline: true },
                    { name: "Observação", value: "Somente administradores podem usar este painel." }
                ]
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    { type: 2, style: 1, label: "Makyo", custom_id: "admin_makyo" },
                    { type: 2, style: 4, label: "Guerra", custom_id: "admin_guerra" },
                    { type: 2, style: 2, label: "Moderação", custom_id: "admin_moderacao" } // Novo botão adicionado
               ]
            }
        ],
        fetchReply: true
     });
};