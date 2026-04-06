const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    PermissionsBitField 
} = require("discord.js");

const { embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    if (message.content !== "!admin") return;

    // 🔒 Permissão
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({
            embeds: [embedErro("❌ Sem permissão.")],
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor(0xFAA61A)
        .setTitle("🛠️ Painel Admin")
        .setDescription("Controle completo dos sistemas Makyo, Guerra e Moderação.")
        .addFields(
            { name: "Makyo", value: "Resetar filas e gerenciar banimentos.", inline: true },
            { name: "Guerra", value: "Gerenciar participantes da guerra.", inline: true },
            { name: "Moderação", value: "Banimentos e blacklist.", inline: true }
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("admin_makyo")
            .setLabel("Makyo")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("admin_guerra")
            .setLabel("Guerra")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("admin_moderacao")
            .setLabel("Moderação")
            .setStyle(ButtonStyle.Secondary)
    );

    return message.reply({
        embeds: [embed],
        components: [row]
    });
};