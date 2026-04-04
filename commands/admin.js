const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const { canalPyaku } = context;

    if (message.content !== "!admin") return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    return message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(0xFAA61A)
                .setTitle("🛠️ Painel Admin")
                .setDescription("Controle total sobre os painéis de Makyo e Guerra.")
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("admin_makyo").setLabel("Makyo").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("admin_guerra").setLabel("Guerra").setStyle(ButtonStyle.Danger)
            )
        ]
    });
};