// interactions/adminButtons.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteTitular } = require("../config/constants");

module.exports = (client, context) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;

        // Funções auxiliares
        const adminErro = (msg) => interaction.reply({ embeds: [embedErro(msg)], ephemeral: true });
        const adminSucesso = (msg) => interaction.reply({ embeds: [embedSucesso(msg)], ephemeral: true });
        const atualizarMensagem = async (embeds, components) => {
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ embeds, components });
                } else {
                    await interaction.update({ embeds, components });
                }
            } catch {
                await interaction.reply({ embeds, components, ephemeral: true });
            }
        };

        const adminButtons = [
            "admin_makyo",
            "admin_guerra",
            "admin_moderacao",
            "voltar_admin",
            "reset_cfk",
            "reset_cfk100",
            "banir_membro",
            "desbanir_membro",
            "ver_banidos",
            "limpar_titular",
            "limpar_reserva",
            "remover_jogador",
            "banir_jogador",
            "blacklist"
        ];

        if (!adminButtons.includes(interaction.customId)) return;

        // Verifica permissão de administrador
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return adminErro("Sem permissão.");
        }

        switch (interaction.customId) {
            case "admin_makyo":
                return atualizarMensagem(
                    [new EmbedBuilder().setTitle("🛠️ Admin Makyo")],
                    [
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
                );

            case "admin_guerra":
                return atualizarMensagem(
                    [new EmbedBuilder().setTitle("🛠️ Admin Guerra")],
                    [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("limpar_titular").setLabel("Limpar Titulares").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("limpar_reserva").setLabel("Limpar Reservas").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("remover_jogador").setLabel("Remover Jogador").setStyle(ButtonStyle.Danger)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                );

            case "admin_moderacao":
                return atualizarMensagem(
                    [new EmbedBuilder().setTitle("🛡️ Moderação")],
                    [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("banir_jogador").setLabel("Banir jogador").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("blacklist").setLabel("Blacklist").setStyle(ButtonStyle.Secondary)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                );

            case "voltar_admin":
                return atualizarMensagem(
                    [new EmbedBuilder().setTitle("🛠️ Admin")],
                    [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("admin_makyo").setLabel("Makyo").setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId("admin_guerra").setLabel("Guerra").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("admin_moderacao").setLabel("Moderação").setStyle(ButtonStyle.Secondary)
                        )
                    ]
                );

            case "reset_cfk":
                context.filaCFK.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                return adminSucesso("Makyo resetado.");

            case "reset_cfk100":
                context.filaCFK100.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                return adminSucesso("Makyo Avançado resetado.");

            case "banir_membro":
                context.esperandoBan = interaction.user.id;
                await context.salvarDados();
                return adminSucesso("Marque o jogador para banir.");

            case "desbanir_membro":
                context.esperandoUnban = interaction.user.id;
                await context.salvarDados();
                return adminSucesso("Marque o jogador para desbanir.");

            case "ver_banidos":
                const lista = context.banidosMakyo.length ? context.banidosMakyo.join("\n") : "Nenhum jogador.";
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xED4245).setTitle("🚫 Banidos").setDescription(lista)], ephemeral: true });

            case "limpar_titular":
                context.filaGuerra.splice(0, limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                return adminSucesso("Titulares limpos.");

            case "limpar_reserva":
                context.filaGuerra.splice(limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                return adminSucesso("Reservas limpas.");

            case "remover_jogador":
                context.esperandoRemover = interaction.user.id;
                await context.salvarDados();
                return adminSucesso("Marque o jogador para remover da Guerra.");

            case "banir_jogador":
                context.esperandoBan = interaction.user.id;
                await context.salvarDados();
                return adminSucesso("Marque o jogador para banir (moderação).");

            case "blacklist":
                context.esperandoBlacklist = interaction.user.id;
                await context.salvarDados();
                return adminSucesso("Marque o jogador para colocar na Blacklist.");
        }
    });
};