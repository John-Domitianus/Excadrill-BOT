const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");

module.exports = async (message, context) => {
    const { canalPyaku, salvarDados, filaCFK, filaCFK100, controleDiario } = context;
    const { limiteCFK, limiteCFK100 } = require("../config/constants");

    if (message.content !== "!makyo") return;

    if (canalPyaku && message.channel.id !== canalPyaku)
        return message.reply({ embeds: [embedErro("Este comando só pode ser usado no canal Pyaku definido.")] });

    return message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🎯 Painel Makyo")
                .setDescription("Aqui você pode entrar nas filas do Makyo, ver vagas disponíveis e sair da fila quando quiser.")
                .addFields(
                    { name: "Makyo Normal", value: "Entre o andar 1 e 100." },
                    { name: "Makyo Avançado", value: "Acima do andar 100+." },
                    { name: "Observação", value: "Você só pode entrar uma vez por dia." }
                )
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("abrir_makyo").setLabel("Entrar Makyo").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId("ver_vagas").setLabel("Ver vagas").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("sair_fila").setLabel("Sair").setStyle(ButtonStyle.Danger)
            )
        ]
    });
};