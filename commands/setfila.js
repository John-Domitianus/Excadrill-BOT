const {
    PermissionsBitField,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

module.exports = async (message) => {
    // Verifica comando
    if (!message.content.startsWith("!setfila")) return;

    // Verifica se é admin
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.channel.send("❌ | Você precisa ser administrador.");
    }

    // Cria embed
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("📌 Configurar canal da fila")
        .setDescription("Selecione abaixo o canal que será usado como **fila**.");

    // Cria menu de seleção
    const menu = new ChannelSelectMenuBuilder()
        .setCustomId("select_fila")
        .setPlaceholder("Selecione um canal...")
        .setMinValues(1)
        .setMaxValues(1)
        .addChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(menu);

    // Envia mensagem
    await message.channel.send({
        embeds: [embed],
        components: [row]
    });
};