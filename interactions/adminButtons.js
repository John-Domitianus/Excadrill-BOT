const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteTitular } = require("../config/constants");

module.exports = async (data, context) => {
    const isInteraction = data.isButton && data.isButton();
    const isMessage = data.author && data.content;

    if (isInteraction) {
        const interaction = data;

        if (!context.dadosCarregados) return;

        const adminButtons = [
            "admin_makyo", "admin_guerra", "admin_moderacao", "voltar_admin",
            "reset_cfk", "reset_cfk100", "banir_membro", "desbanir_membro", "ver_banidos",
            "limpar_titular", "limpar_reserva", "remover_jogador",
            "banir_jogador", "blacklist"
        ];

        if (!adminButtons.includes(interaction.customId) && !interaction.customId.startsWith("jogador_")) return false;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.followUp({
                embeds: [embedErro("❌ Sem permissão.")],
                ephemeral: true
            });
            return true;
        }

        const sucesso = (msg) =>
            interaction.followUp({ embeds: [embedSucesso(msg)], ephemeral: true });

        // ================= HANDLER DE CLIQUE DO JOGADOR =================
        if (interaction.customId.startsWith("jogador_")) {
            const jogadorId = interaction.customId.split("_")[1];

            // Banir jogador (banir_membro ou banir_jogador)
            if (context.esperandoBan === interaction.user.id) {
                if (!context.banidosMakyo.includes(jogadorId)) {
                    context.banidosMakyo.push(jogadorId);
                    context.esperandoBan = null;
                    await context.salvarDados();
                    return interaction.followUp({ content: `✅ Jogador ${jogadorId} banido com sucesso!`, ephemeral: true });
                } else {
                    return interaction.followUp({ content: "❌ Jogador já está banido.", ephemeral: true });
                }
            }

            // Desbanir jogador
            if (context.esperandoUnban === interaction.user.id) {
                const index = context.banidosMakyo.indexOf(jogadorId);
                if (index > -1) {
                    context.banidosMakyo.splice(index, 1);
                    context.esperandoUnban = null;
                    await context.salvarDados();
                    return interaction.followUp({ content: `✅ Jogador ${jogadorId} desbanido com sucesso!`, ephemeral: true });
                } else {
                    return interaction.followUp({ content: "❌ Jogador não está banido.", ephemeral: true });
                }
            }

            // Remover jogador da Guerra
            if (context.esperandoRemover === interaction.user.id) {
                const index = context.filaGuerra.indexOf(jogadorId);
                if (index > -1) {
                    context.filaGuerra.splice(index, 1);
                    context.esperandoRemover = null;
                    await context.salvarDados();
                    atualizarListaGuerra(context.client);
                    return interaction.followUp({ content: `✅ Jogador ${jogadorId} removido da Guerra.`, ephemeral: true });
                } else {
                    return interaction.followUp({ content: "❌ Jogador não está na Guerra.", ephemeral: true });
                }
            }
        }

        // ================= SWITCH DE BOTÕES DO PAINEL =================
        switch (interaction.customId) {

            // ================= MENU =================
            case "admin_makyo":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("🛠️ Admin Makyo")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("reset_cfk").setLabel("Reset Makyo").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("reset_cfk100").setLabel("Reset Avançado").setStyle(ButtonStyle.Danger)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("banir_membro").setLabel("Banir").setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId("desbanir_membro").setLabel("Desbanir").setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId("ver_banidos").setLabel("Ver Banidos").setStyle(ButtonStyle.Primary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "admin_guerra":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("🛠️ Admin Guerra")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("limpar_titular").setLabel("Limpar Titulares").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("limpar_reserva").setLabel("Limpar Reservas").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("remover_jogador").setLabel("Remover Jogador").setStyle(ButtonStyle.Danger)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "admin_moderacao":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("🛡️ Moderação")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("banir_jogador").setLabel("Banir jogador").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("blacklist").setLabel("Blacklist").setStyle(ButtonStyle.Secondary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            case "voltar_admin":
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle("🛠️ Painel Admin")],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("admin_makyo").setLabel("Makyo").setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId("admin_guerra").setLabel("Guerra").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("admin_moderacao").setLabel("Moderação").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            // ================= MAKYO =================
            case "reset_cfk":
                context.filaCFK.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                sucesso("Makyo resetado.");
                return true;

            case "reset_cfk100":
                context.filaCFK100.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                sucesso("Makyo Avançado resetado.");
                return true;

            case "banir_membro":
                context.esperandoBan = interaction.user.id;
                await context.salvarDados();
                return interaction.followUp({ content: "Marque o jogador para banir.", ephemeral: true });

            case "desbanir_membro":
                context.esperandoUnban = interaction.user.id;
                await context.salvarDados();
                return interaction.followUp({ content: "Marque o jogador para desbanir.", ephemeral: true });

            case "ver_banidos":
                const lista = context.banidosMakyo.length
                    ? context.banidosMakyo.join("\n")
                    : "Nenhum jogador.";

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("🚫 Banidos")
                            .setDescription(lista)
                    ],
                    ephemeral: true
                });

            // ================= GUERRA =================
            case "limpar_titular":
                context.filaGuerra.splice(0, limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                sucesso("Titulares limpos.");
                return true;

            case "limpar_reserva":
                context.filaGuerra.splice(limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                sucesso("Reservas limpas.");
                return true;

            case "remover_jogador":
                context.esperandoRemover = interaction.user.id;
                await context.salvarDados();
                return interaction.followUp({ content: "Marque o jogador para remover da Guerra.", ephemeral: true });

            // ================= MODERAÇÃO =================
            case "banir_jogador":
                context.esperandoBan = interaction.user.id;
                await context.salvarDados();
                return interaction.followUp({ content: "Marque o jogador para banir.", ephemeral: true });

            case "blacklist":
                context.esperandoBlacklist = interaction.user.id;
                context.etapaBlacklist = "id";
                context.tempBlacklist = {};
                sucesso("Digite o ID (15 números).");
                return true;
        }
    }

    // ================= BLACKLIST =================
    if (isMessage) {
        const message = data;

        if (context.esperandoBlacklist === message.author.id) {
            const content = message.content.trim();

            // ETAPA 1 - ID
            if (context.etapaBlacklist === "id") {
                if (!/^\d{15}$/.test(content)) {
                    return message.reply("❌ ID inválido. Deve ter 15 números.");
                }

                context.tempBlacklist.id = content;
                context.etapaBlacklist = "nome";

                return message.reply("✏️ Agora digite o nick.");
            }

            // ETAPA 2 - NOME
            if (context.etapaBlacklist === "nome") {
                context.tempBlacklist.nome = content;

                context.listaNegra.push({
                    nome: context.tempBlacklist.nome,
                    id: context.tempBlacklist.id
                });

                await context.salvarDados();

                context.esperandoBlacklist = null;
                context.etapaBlacklist = null;
                context.tempBlacklist = null;

                return message.reply("✅ Jogador adicionado à blacklist.");
            }
        }
    }
};