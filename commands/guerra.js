const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { embedErro } = require("../utils/embeds");

module.exports = async (message, context) => {
    const { canalPyaku } = context;

    if (message.content !== "!guerra") return;

    if (canalPyaku && message.channel.id !== canalPyaku)
        return message.reply({ embeds: [embedErro("Este comando só pode ser usado no canal Pyaku definido.")] });

    return message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("⚔️ Painel Guerra")
                .setDescription("Aqui você pode entrar na guerra escolhendo uma posição e ver a lista de participantes.")
                .addFields(
                    { name: "Titular", value: "Entre como titular. Limite de 30 jogadores.", inline: true },
                    { name: "Reserva", value: "Entre como reserva. Limite de 10 jogadores.", inline: true },
                    { name: "Observação", value: "Você não poderá sair ao entrar, escolha com atenção." }
                )
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("abrir_guerra").setLabel("Entrar Guerra").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId("ver_guerra").setLabel("Ver lista").setStyle(ButtonStyle.Secondary)
            )
        ]
    });
};