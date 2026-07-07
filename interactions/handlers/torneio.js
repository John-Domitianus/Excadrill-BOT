const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const { embedErro, embedSucesso } = require("../../utils/embeds");
const { limiteSingle, limiteDouble } = require("../../config/constants");
const {
    gerarPartidasSingle,
    gerarPartidasDouble
} = require("../../utils/torneio");

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
}

module.exports = async (interaction, context) => {

    const id = interaction.customId;

    const isTorneio =
        id === "abrir_guerra" ||
        id === "voltar_guerra" ||
        id === "torneio_single" ||
        id === "torneio_double" ||
        id === "ver_guerra";

    if (!isTorneio) return false;

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
        console.log("[TORNEIO] deferUpdate OK");
    }

    const nome = interaction.member.displayName;
    const hora = pegarHorario();

    const erro = (msg) =>
        interaction.followUp({
            embeds: [embedErro(msg)],
            ephemeral: true
        });

    const sucesso = (msg) =>
        interaction.followUp({
            embeds: [embedSucesso(msg)],
            ephemeral: true
        });

    switch (id) {

        // ============================
        // ABRIR TORNEIO
        // ============================

        case "abrir_guerra":

            return interaction.editReply({

                embeds: [

                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("🏆 Torneios")
                        .setDescription("Escolha a modalidade que deseja participar.")

                ],

                components: [

                    new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setCustomId("torneio_single")
                            .setLabel("Single")
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId("torneio_double")
                            .setLabel("Double")
                            .setStyle(ButtonStyle.Primary)

                    ),

                    new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setCustomId("voltar_guerra")
                            .setLabel("Voltar")
                            .setStyle(ButtonStyle.Secondary)

                    )

                ]

            });

        // ============================
        // VOLTAR
        // ============================

        case "voltar_guerra":

            return interaction.editReply({

                embeds: [

                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("🏆 Painel Torneios")

                ],

                components: [

                    new ActionRowBuilder().addComponents(

                        new ButtonBuilder()
                            .setCustomId("abrir_guerra")
                            .setLabel("Entrar Torneio")
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId("ver_guerra")
                            .setLabel("Ver Torneio")
                            .setStyle(ButtonStyle.Primary)

                    )

                ]

            });

        // ============================
        // SINGLE
        // ============================

        case "torneio_single":

            if (context.filaSingle.some(p => p.id === interaction.user.id))
                return erro("Você já está inscrito no torneio Single.");

            if (context.filaDouble.some(p => p.id === interaction.user.id))
                return erro("Você já está inscrito no torneio Double.");

            if (!context.torneio.single.aberto)
                return erro("As inscrições para o Single estão encerradas.");

            context.filaSingle.push({
                id: interaction.user.id,
                nome,
                hora
            });

            // FECHA E SORTEIA AUTOMATICAMENTE
            if (context.filaSingle.length === limiteSingle) {

                context.torneio.single.aberto = false;
                context.torneio.single.sorteado = true;

                context.partidasSingle = gerarPartidasSingle(
                    context.filaSingle
                );
            }

            await context.salvarDados();

            return sucesso("Inscrição realizada no torneio Single.");

        // ============================
        // DOUBLE
        // ============================

        case "torneio_double":

            if (context.filaSingle.some(p => p.id === interaction.user.id))
                return erro("Você já está inscrito no torneio Single.");

            if (context.filaDouble.some(p => p.id === interaction.user.id))
                return erro("Você já está inscrito no torneio Double.");

            if (!context.torneio.double.aberto)
                return erro("As inscrições para o Double estão encerradas.");

            context.filaDouble.push({
                id: interaction.user.id,
                nome,
                hora
            });

            // FECHA E SORTEIA AUTOMATICAMENTE
            if (context.filaDouble.length === limiteDouble) {

                context.torneio.double.aberto = false;
                context.torneio.double.sorteado = true;

                context.partidasDouble = gerarPartidasDouble(
                    context.filaDouble
                );
            }

            await context.salvarDados();

            return sucesso("Inscrição realizada no torneio Double.");

        // ============================
        // VER TORNEIO
        // ============================

        case "ver_guerra":

            return interaction.followUp({

                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("🏆 Ver Torneio")
                        .setDescription("Escolha a modalidade.")
                ],

                components: [

                    new ActionRowBuilder().addComponents(

                        new StringSelectMenuBuilder()
                            .setCustomId("select_lista_torneio")
                            .setPlaceholder("Selecione uma modalidade")
                            .addOptions(
                                {
                                    label: "Single",
                                    value: "single",
                                    emoji: "⚔️"
                                },
                                {
                                    label: "Double",
                                    value: "double",
                                    emoji: "👥"
                                }
                            )

                    )

                ],

                ephemeral: true

            });

    }

    return false;

};