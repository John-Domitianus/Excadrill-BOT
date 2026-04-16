const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("../config/constants");
const adminHandler = require("./adminButtons");
const { salvarDados } = require("../services/dataManager");

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

        // ✅ aceita botão e select menu
        if (!interaction.isButton() && !interaction.isChannelSelectMenu()) return;

        // ================= SELECT MENU =================
        if (interaction.isChannelSelectMenu()) {

            if (interaction.customId === "select_fila") {
                const canalId = interaction.values[0];

                await interaction.deferReply({ ephemeral: true });

                try {
                    context.setCanalFilaCompleta(canalId);
                    await salvarDados();

                    await interaction.editReply({
                        content: `✅ | Canal da fila definido para <#${canalId}>`
                    });

                } catch (err) {
                    console.error("Erro ao salvar canal:", err);

                    await interaction.editReply({
                        content: "❌ Erro ao salvar o canal."
                    });
                }

            } else if (interaction.customId === "select_ban") {
                const canalId = interaction.values[0];

                await interaction.deferReply({ ephemeral: true });

                try {
                    context.setCanalBan(canalId);
                    await salvarDados();

                    await interaction.editReply({
                        content: `✅ | Canal de ban definido para <#${canalId}>`
                    });

                } catch (err) {
                    console.error("Erro ao salvar canal de ban:", err);

                    await interaction.editReply({
                        content: "❌ Erro ao salvar o canal de ban."
                    });
                }
            }

            return; // 🔴 ESSENCIAL — aqui fora
        }
        // ================= BOTÕES =================
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferUpdate();
        }

        const nome = interaction.member.displayName;
        const id = interaction.user.id;
        const hora = pegarHorario();

        const handled = await adminHandler(interaction, context);
        if (handled) return;

        const erro = (msg) => interaction.followUp({ embeds: [embedErro(msg)], ephemeral: true });
        const sucesso = (msg) => interaction.followUp({ embeds: [embedSucesso(msg)], ephemeral: true });

        if (context.banidosMakyo.some(p => p.id === interaction.user.id)) {
            return erro("Você está banido dos Makyo's.");
        }

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
                const filaMakyo = context.filaCFK;
                const filaAvancado = context.filaCFK100;

                const limiteMakyo = limiteCFK;
                const limiteAvancado = limiteCFK100;

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("📋 Lista de Vagas")
                            .setDescription("Confira abaixo as filas e vagas restantes:")
                            .addFields(
                                {
                                    name: "📌 Normal",
                                    value: filaMakyo.length > 0 ? filaMakyo.map(p => `• ${p.nome}`).join("\n") : "Nenhum",
                                    inline: true
                                },
                                {
                                    name: "🎯 Avançado",
                                    value: filaAvancado.length > 0 ? filaAvancado.map(p => `• ${p.nome}`).join("\n") : "Nenhum",
                                    inline: true
                                },
                                {
                                    name: "💡 Vagas Restantes",
                                    value: `• Normal = ${limiteMakyo - filaMakyo.length} vagas\n• Avançado = ${limiteAvancado - filaAvancado.length} vagas`,
                                    inline: false
                                }
                            )
                            .setFooter({ text: "Sistema de Filas • Pyaku" })
                    ],
                    ephemeral: true
                });

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
                if (context.filaGuerra.find(p => p.id === id)) return erro("Já está na guerra.");
                if (context.filaGuerra.length >= limiteTitular) return erro("Cheio.");

                context.filaGuerra.push({ id, nome, hora, tipo: "titular" });
                await context.salvarDados();
                atualizarListaGuerra(client);
                return sucesso("Entrou como titular.");

            case "reserva":
                if (context.filaGuerra.find(p => p.id === id)) return erro("Já está na guerra.");
                if (context.filaGuerra.length >= limiteTitular + limiteReserva) return erro("Cheio.");

                context.filaGuerra.push({ id, nome, hora, tipo: "reserva" });
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
        }
    });

    client.on("messageCreate", async (message) => {
        if (!context.dadosCarregados) return;
        if (message.author.bot) return;

        await adminHandler(message, context);
    });
};