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

module.exports = async (interaction, context) => {
   
        if (!interaction.isButton()) return;     
        if (!context.dadosCarregados) return;


        const adminButtons = [
            "admin_makyo", "admin_guerra", "admin_moderacao", "voltar_admin",
            "reset_cfk", "reset_cfk100", "banir_membro", "desbanir_membro", "ver_banidos",
            "limpar_titular", "limpar_reserva", "remover_jogador",
            "banir_jogador", "blacklist"
        ];

        if (!adminButtons.includes(interaction.customId)) return;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.followUp({
                embeds: [embedErro("❌ Sem permissão.")],
                ephemeral: true
            });
        }

        const sucesso = (msg) =>
            interaction.followUp({ embeds: [embedSucesso(msg)], ephemeral: true });

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
                return true;

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
                return true;

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
                return true;

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
                return true;

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
                sucesso("Marque o jogador para banir.");
                return true;

            case "desbanir_membro":
                context.esperandoUnban = interaction.user.id;
                await context.salvarDados();
                sucesso("Marque o jogador para desbanir.");
                return true;

            case "ver_banidos":
                const lista = context.banidosMakyo.length
                    ? context.banidosMakyo.join("\n")
                    : "Nenhum jogador.";

                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("🚫 Banidos")
                            .setDescription(lista)
                    ],
                    ephemeral: true
                });
                return true;

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
                sucesso("Marque o jogador para remover da Guerra.");
                return true;
            // ================= MODERAÇÃO =================
            case "banir_jogador":
                context.esperandoBan = interaction.user.id;
                sucesso("Marque o jogador para banir.");
                return true;
                
            case "blacklist":
                context.esperandoBlacklist = interaction.user.id;
                context.etapaBlacklist = "id";
                context.tempBlacklist = {};
                sucesso("Digite o ID (15 números).");
                return true;
        }
        return false;
    };
    
     