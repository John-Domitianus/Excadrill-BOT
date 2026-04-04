const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const {
    limiteCFK,
    limiteCFK100,
    limiteTitular,
    limiteReserva
} = require("../config/constants");

module.exports = async (interaction, context, client) => {
    if (!context.dadosCarregados) return;
    if (!interaction.isButton()) return;

    const nome = interaction.member.displayName;

    const erro = (msg) =>
        interaction.reply({ embeds: [embedErro(msg)], ephemeral: true });

    const sucesso = (msg) =>
        interaction.reply({ embeds: [embedSucesso(msg)], ephemeral: true });

    if (context.banidosMakyo.includes(nome)) return erro("Você está banido.");

    const hasAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    if (!hasAdmin) return erro("Sem permissão.");

    switch (interaction.customId) {

        case "admin_makyo":
            return interaction.update({
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
            return interaction.update({
                embeds: [new EmbedBuilder().setTitle("🛠️ Admin Guerra")],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("limpar_titular").setLabel("Limpar Titulares").setStyle(ButtonStyle.Danger),
                        new ButtonBuilder().setCustomId("limpar_reserva").setLabel("Limpar Reservas").setStyle(ButtonStyle.Danger)
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("voltar_admin").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
                    )
                ]
            });

        case "voltar_admin":
            return interaction.update({
                embeds: [new EmbedBuilder().setTitle("🛠️ Admin")],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("admin_makyo").setLabel("Makyo").setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setCustomId("admin_guerra").setLabel("Guerra").setStyle(ButtonStyle.Danger)
                    )
                ]
            });

        case "reset_cfk":
            context.filaCFK.length = 0;
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Makyo resetado.");

        case "reset_cfk100":
            context.filaCFK100.length = 0;
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Makyo Avançado resetado.");

        case "banir_membro":
            context.esperandoBan = interaction.user.id;
            await context.salvarDados();
            return sucesso("Marque o jogador para banir.");

        case "desbanir_membro":
            context.esperandoUnban = interaction.user.id;
            await context.salvarDados();
            return sucesso("Marque o jogador para desbanir.");

        case "ver_banidos":
            const lista = context.banidosMakyo.length
                ? context.banidosMakyo.join("\n")
                : "Nenhum jogador.";
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor(0xED4245).setTitle("🚫 Banidos").setDescription(lista)],
                ephemeral: true
            });

        case "limpar_titular":
            context.filaGuerra.splice(0, limiteTitular);
            await context.salvarDados();
            atualizarListaGuerra(client);
            return sucesso("Titulares limpos.");

        case "limpar_reserva":
            context.filaGuerra.splice(limiteTitular);
            await context.salvarDados();
            atualizarListaGuerra(client);
            return sucesso("Reservas limpas.");
    }
};