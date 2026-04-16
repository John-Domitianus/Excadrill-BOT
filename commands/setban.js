const {
    PermissionsBitField,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

module.exports = async (message) => {
    // Verifica comando
    if (!message.content.startsWith("!setban")) return;

    // Permissão
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("❌ | Você precisa ser administrador.");
    }

    // Embed
    const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("🚫 Configurar canal de ban")
        .setDescription("Selecione o canal onde serão enviados os **logs de banimento**.");

    // Menu
    const menu = new ChannelSelectMenuBuilder()
        .setCustomId("select_ban") // IMPORTANTE
        .setPlaceholder("Selecione um canal...")
        .setMinValues(1)
        .setMaxValues(1)
        .addChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.channel.send({
        embeds: [embed],
        components: [row]
    });
};