const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("../config/constants");
const adminButtons = require("../interactions/adminbuttons");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

module.exports = (client, context) => {
    client.on("interactionCreate", async (interaction) => {

        if (!context.dadosCarregados) return;
        if (!interaction.isButton()) return;

        await interaction.deferUpdate(); // evita erro de múltiplas respostas
        const nome = interaction.member.displayName;
        const hora = pegarHorario();

        const erro = (msg) =>
            interaction.followUp({ embeds: [embedErro(msg)], ephemeral: true });

        const sucesso = (msg) =>
            interaction.followUp({ embeds: [embedSucesso(msg)], ephemeral: true });

        if (context.banidosMakyo.includes(nome)) return erro("Você está banido dos Makyo's.");

        switch (interaction.customId) {

            // ================= MAKYO =================
            case "abrir_makyo":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("Escolha o Makyo")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("makyo_normal").setLabel("Makyo Normal").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("makyo_100").setLabel("Makyo Avançado").setStyle(ButtonStyle.Primary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_makyo").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "voltar_makyo":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("🎯 Painel Makyo")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("abrir_makyo").setLabel("Entrar Makyo").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("ver_vagas").setLabel("Ver vagas").setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId("sair_fila").setLabel("Sair").setStyle(ButtonStyle.Danger)
                        )
                    ]
                });

            case "makyo_normal":
                if (context.controleDiario[nome] === hoje()) return erro("Você já participou hoje.");
                if (context.filaCFK.find(p => p.nome === nome)) return erro("Já está na fila.");
                if (context.filaCFK.length >= limiteCFK) return erro("Fila cheia.");

                context.filaCFK.push({ nome, hora });
                context.controleDiario[nome] = hoje();
                await context.salvarDados();
                atualizarListaCompleta(client);
                return sucesso("Entrou no Makyo Normal.");

            case "makyo_100":
                if (context.controleDiario[nome] === hoje()) return erro("Você já participou hoje.");
                if (context.filaCFK100.find(p => p.nome === nome)) return erro("Já está na fila.");
                if (context.filaCFK100.length >= limiteCFK100) return erro("Fila cheia.");

                context.filaCFK100.push({ nome, hora });
                context.controleDiario[nome] = hoje();
                await context.salvarDados();
                atualizarListaCompleta(client);
                return sucesso("Entrou no Makyo Avançado.");

            case "ver_vagas":
                return sucesso(`Makyo: ${context.filaCFK.length}/${limiteCFK}\nAvançado: ${context.filaCFK100.length}/${limiteCFK100}`);

            case "sair_fila":
                context.filaCFK = context.filaCFK.filter(p => p.nome !== nome);
                context.filaCFK100 = context.filaCFK100.filter(p => p.nome !== nome);
                await context.salvarDados();
                atualizarListaCompleta(client);
                return sucesso("Saiu da fila.");

            // ================= GUERRA =================
            case "abrir_guerra":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("⚔️ Escolha posição")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("titular").setLabel("Titular").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("reserva").setLabel("Reserva").setStyle(ButtonStyle.Primary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_guerra").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "voltar_guerra":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("⚔️ Painel Guerra")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("abrir_guerra").setLabel("Entrar Guerra").setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId("ver_guerra").setLabel("Ver lista").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "titular":
                if (context.filaGuerra.find(p => p.nome === nome)) return erro("Já está na guerra.");
                if (context.filaGuerra.length >= limiteTitular) return erro("Cheio.");

                context.filaGuerra.push({ nome, hora, tipo: "titular" });
                await context.salvarDados();
                atualizarListaGuerra(client);
                return sucesso("Entrou como titular.");

            case "reserva":
                if (context.filaGuerra.find(p => p.nome === nome)) return erro("Já está na guerra.");
                if (context.filaGuerra.length >= limiteTitular + limiteReserva) return erro("Cheio.");

                context.filaGuerra.push({ nome, hora, tipo: "reserva" });
                await context.salvarDados();
                atualizarListaGuerra(client);
                return sucesso("Entrou como reserva.");

            case "ver_guerra":
                const titulares = context.filaGuerra.filter(p => p.tipo === "titular");
                const reservas = context.filaGuerra.filter(p => p.tipo === "reserva");

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("📋 Lista Guerra")
                            .addFields(
                                { name: "Titulares", value: titulares.map(p => p.nome).join("\n") || "Nenhum" },
                                { name: "Reservas", value: reservas.map(p => p.nome).join("\n") || "Nenhum" }
                            )
                    ],
                    ephemeral: true
                });

            // ================= ADMIN =================
            case "admin_makyo":
            case "admin_guerra":
            case "voltar_admin":
            case "reset_cfk":
            case "reset_cfk100":
            case "banir_membro":
            case "desbanir_membro":
            case "ver_banidos":
            case "limpar_titular":
            case "limpar_reserva":
                return await require("../adminButtons")(interaction, context, client);

            default:
                return erro("Botão não reconhecido.");
        }
    });
};
