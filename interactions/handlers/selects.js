const { EmbedBuilder } = require("discord.js");
const { atualizarListaCompleta } = require("../../utils/lista");
const {
    limiteCFK,
    limiteCFK100,
    limiteSingle,
    limiteDouble
} = require("../../config/constants");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
}

module.exports = async (interaction, context) => {

    // ================= CHANNEL SELECT =================

    if (interaction.isChannelSelectMenu()) {

        const id = interaction.customId;

        await interaction.deferReply({ ephemeral: true });

        if (id === "select_fila") {
            context.setCanalFilaCompleta(interaction.values[0]);
            await context.salvarDados();

            return interaction.editReply({
                content: "Canal da fila atualizado."
            });
        }

        if (id === "select_ban") {
            context.setCanalBan(interaction.values[0]);
            await context.salvarDados();

            return interaction.editReply({
                content: "Canal de ban atualizado."
            });
        }
    }

    // ================= STRING SELECT =================

    if (interaction.isStringSelectMenu()) {

        // ==================================================
        // ENTRAR EM EVENTOS
        // ==================================================

        if (interaction.customId === "select_entrar_eventos") {

            const tipo = interaction.values[0];
            const nome = interaction.member.displayName;
            const hora = pegarHorario();

            if (context.banidosMakyo.some(p => p.id === interaction.user.id)) {
                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setDescription("❌ Você está banido dos eventos.")
                    ],
                    components: []
                });
            }

            if (context.controleDiario[nome] === hoje()) {
                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setDescription("❌ Você já participou hoje.")
                    ],
                    components: []
                });
            }

            if (tipo === "comum") {

                if (context.filaCFK.find(p => p.nome === nome)) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xED4245)
                                .setDescription("❌ Você já está inscrito neste evento.")
                        ],
                        components: []
                    });
                }

                if (context.filaCFK.length >= limiteCFK) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xED4245)
                                .setDescription("❌ A fila do Evento Comum está cheia.")
                        ],
                        components: []
                    });
                }

                context.filaCFK.push({
                    nome,
                    hora
                });

            } else {

                if (context.filaCFK100.find(p => p.nome === nome)) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xED4245)
                                .setDescription("❌ Você já está inscrito neste evento.")
                        ],
                        components: []
                    });
                }

                if (context.filaCFK100.length >= limiteCFK100) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xED4245)
                                .setDescription("❌ A fila do Evento Especial está cheia.")
                        ],
                        components: []
                    });
                }

                context.filaCFK100.push({
                    nome,
                    hora
                });

            }

            context.controleDiario[nome] = hoje();

            await context.salvarDados();

            atualizarListaCompleta(context.client);

            return interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x57F287)
                        .setTitle("✅ Inscrição realizada")
                        .setDescription(
                            tipo === "comum"
                                ? "Você entrou no **Evento Comum**."
                                : "Você entrou no **Evento Especial**."
                        )
                ],
                components: []
            });
        }

        // ==================================================
        // LISTA DE EVENTOS
        // ==================================================

        if (interaction.customId === "select_lista_eventos") {

            const tipo = interaction.values[0];

            const lista =
                tipo === "comum"
                    ? context.filaCFK
                    : context.filaCFK100;

            const titulo =
                tipo === "comum"
                    ? "📋 Evento Comum"
                    : "⭐ Evento Especial";

            const descricao = lista.length
                ? lista.map((p, i) => `${i + 1}. ${p.nome} ${p.hora}`).join("\n")
                : "Nenhum jogador inscrito.";

            return interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle(titulo)
                        .setDescription(descricao)
                        .setFooter({
                            text: `Total de inscritos: ${lista.length}`
                        })
                ],
                components: []
            });
        }

        // ==================================================
        // LISTA DE TORNEIOS
        // ==================================================
        if (interaction.customId === "select_lista_torneio") {

            const modalidade = interaction.values[0];

            if (modalidade === "single") {

                if (!context.torneio.single.sorteado) {

                    const faltam = limiteSingle - context.filaSingle.length;

                    return interaction.update({

                        embeds: [

                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle("🏆 Torneio Single")
                                .setDescription(
                                    `Inscritos: **${context.filaSingle.length}/${limiteSingle}**\n\n` +
                                    `O torneio será sorteado automaticamente quando atingir o limite de jogadores.\n\n` +
                                    `Faltam **${faltam}** jogador(es).`
                                )

                        ],

                        components: []

                    });

                }

                const descricao = context.partidasSingle
                    .map((partida, i) =>
                        `**${i + 1}.** ${partida.jogador1.nome} ⚔️ ${partida.jogador2.nome}`
                    )
                    .join("\n\n");

                return interaction.update({

                    embeds: [

                        new EmbedBuilder()
                            .setColor(0x57F287)
                            .setTitle("🏆 Confrontos - Single")
                            .setDescription(descricao)

                    ],

                    components: []

                });

            }

            // ================= DOUBLE =================

            if (!context.torneio.double.sorteado) {

                const faltam = limiteDouble - context.filaDouble.length;

                return interaction.update({

                    embeds: [

                        new EmbedBuilder()
                            .setColor(0x5865F2)
                            .setTitle("👥 Torneio Double")
                            .setDescription(
                                `Inscritos: **${context.filaDouble.length}/${limiteDouble}**\n\n` +
                                `O torneio será sorteado automaticamente quando atingir o limite de jogadores.\n\n` +
                                `Faltam **${faltam}** jogador(es).`
                            )

                    ],

                    components: []

                });

            }

            const descricao = context.partidasDouble
                .map((partida, i) =>
                    `**${i + 1}.** ${partida.dupla1[0].nome}, ${partida.dupla1[1].nome}\n` +
                    `🆚\n` +
                    `${partida.dupla2[0].nome}, ${partida.dupla2[1].nome}`
                )
                .join("\n\n");

            return interaction.update({

                embeds: [

                    new EmbedBuilder()
                        .setColor(0x57F287)
                        .setTitle("👥 Confrontos - Double")
                        .setDescription(descricao)

                ],

                components: []

            });

        }
        // ==================================================
        // TAG DO NICK
        // ==================================================

        if (interaction.customId === "select_tag_nick") {

            context.fluxoNick[interaction.user.id] = {
                esperandoNick: true,
                tagEscolhida: "𝒔𝒖𝒃𝒕 º"
            };

            return interaction.reply({
                content: "Escreva seu nickname.",
                ephemeral: true
            });
        }
    }

    return false;
};