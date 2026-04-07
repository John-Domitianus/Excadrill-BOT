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

    if (!context.dadosCarregados) return;

    const sucesso = (msg) => data.followUp
        ? data.followUp({ embeds: [embedSucesso(msg)], ephemeral: true })
        : null;

    // ================= INTERACTIONS =================
    if (isInteraction) {
        const interaction = data;

        const adminButtons = [
            "admin_makyo", "admin_guerra", "admin_moderacao", "voltar_admin",
            "reset_cfk", "reset_cfk100", "banir_membro", "banir_jogador", "desbanir_membro",
            "ver_banidos", "limpar_titular", "limpar_reserva", "remover_jogador",
            "blacklist", "ver_blacklist", "ver_removidos"
        ];

        if (!adminButtons.includes(interaction.customId) && !interaction.customId.startsWith("jogador_")) return false;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.followUp({
                embeds: [embedErro("❌ Sem permissão.")],
                ephemeral: true
            });
            return true;
        }

        if (interaction.customId.startsWith("jogador_")) return false;

        switch (interaction.customId) {
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
                            new ButtonBuilder().setCustomId("ver_removidos").setLabel("Ver Removidos").setStyle(ButtonStyle.Primary),
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
                            new ButtonBuilder().setCustomId("blacklist").setLabel("Blacklist").setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder().setCustomId("ver_blacklist").setLabel("Ver Blacklist").setStyle(ButtonStyle.Primary)
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

            case "reset_cfk":
                context.filaCFK.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                return sucesso("Makyo resetado.");

            case "reset_cfk100":
                context.filaCFK100.length = 0;
                await context.salvarDados();
                atualizarListaCompleta(context.client);
                return sucesso("Makyo Avançado resetado.");

            case "banir_membro":
                context.tipoBan = "makyo";
                context.esperandoBan = interaction.user.id;
                context.etapaBan = "marcar";
                return interaction.followUp({ content: "❗ Marque o jogador para banir.", ephemeral: true });

            case "desbanir_membro":
                context.esperandoUnban = interaction.user.id;
                return interaction.followUp({ content: "❗ Marque o jogador para desbanir.", ephemeral: true });

            case "ver_banidos":
                const listaBanidos = context.banidosMakyo.length
                    ? context.banidosMakyo.map(p => `Nick: ${p.nome} | Motivo: ${p.motivo || "Sem motivo"}`).join("\n")
                    : "Nenhum jogador banido.";
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("🚫 Banidos")
                            .setDescription(listaBanidos)
                    ],
                    ephemeral: true
                });

            case "limpar_titular":
                context.filaGuerra.splice(0, limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                return sucesso("Titulares limpos.");

            case "limpar_reserva":
                context.filaGuerra.splice(limiteTitular);
                await context.salvarDados();
                atualizarListaGuerra(context.client);
                return sucesso("Reservas limpas.");

            case "remover_jogador":
                context.esperandoRemover = interaction.user.id;
                context.etapaRemover = "marcar";
                return interaction.followUp({ content: "❗ Marque o jogador para remover da Guerra.", ephemeral: true });

            case "ver_removidos":
                const removidos = context.removidosGuerra?.length
                    ? context.removidosGuerra.map(p => `Nick: ${p.nome} | Motivo: ${p.motivo}`).join("\n")
                    : "Nenhum jogador removido.";
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("🗑️ Jogadores removidos da Guerra")
                            .setDescription(removidos)
                    ],
                    ephemeral: true
                });

            case "blacklist":
                context.esperandoBlacklist = interaction.user.id;
                context.etapaBlacklist = "id";
                context.tempBlacklist = {};
                return sucesso("Digite o ID (15 números).");

            case "ver_blacklist":
                const listaBlacklist = context.listaNegra.length
                    ? context.listaNegra.map(j => `ID: ${j.id} | Nick: ${j.nome}`).join("\n")
                    : "Nenhum jogador na blacklist.";
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xED4245)
                            .setTitle("🚫 Blacklist")
                            .setDescription(listaBlacklist)
                    ],
                    ephemeral: true
                });

            case "banir_jogador":
                context.esperandoBan = interaction.user.id;
                context.etapaBan = "marcar";
                context.tipoBan = "discord";
                return interaction.followUp({
                    content: "❗ Marque o jogador para banir do servidor.",
                    ephemeral: true
                });
        }
    }

    // ================= MESSAGES =================
    if (isMessage) {
        const message = data;

        // ---------- REMOÇÃO DE JOGADOR ----------
        if (context.esperandoRemover === message.author.id) {
            const step = context.etapaRemover;

            if (step === "marcar") {
                const mention = message.mentions.members.first();
                if (!mention) return message.reply("❌ Marque um jogador válido.");

                context.tempRemover = { id: mention.id, nome: mention.user.username };
                context.etapaRemover = "motivo";
                return message.reply("✏️ Digite o motivo da remoção.");
            }

            if (step === "motivo") {
                const motivo = message.content.trim();
                const { id, nome } = context.tempRemover;

                context.filaGuerra = context.filaGuerra.filter(p => p.id !== id);
                context.removidosGuerra = context.removidosGuerra || [];
                context.removidosGuerra.push({ id, nome, motivo });

                context.esperandoRemover = null;
                context.etapaRemover = null;
                context.tempRemover = null;

                atualizarListaGuerra(context.client);
                await context.salvarDados();

                return message.reply(`✅ Jogador ${nome} removido da Guerra. Motivo: "${motivo}"`);
            }
        }

        // ---------- BAN DE JOGADOR ----------
        if (context.esperandoBan === message.author.id) {
            const step = context.etapaBan;
            const isBan = context.esperandoBan === message.author.id;

            if (step === "marcar") {
                const mention = message.mentions.members.first();
                if (!mention) return message.reply("❌ Marque um jogador válido.");

                context.tempBan = { id: mention.id, nome: mention.user.username };
                context.etapaBan = "motivo";
                return message.reply("✏️ Digite o motivo da ação.");
            }

            if (step === "motivo") {
                const motivo = message.content.trim();
                const { id, nome } = context.tempBan;

                if (context.tipoBan === "discord") {
                    try {
                        const member = await message.guild.members.fetch(id).catch(() => null);
                        if (!member) return message.reply("❌ Não encontrei esse usuário no servidor.");
                        if (!member.bannable) return message.reply("❌ Não posso banir esse usuário (hierarquia).");

                        await member.ban({ reason: motivo });

                        const canalLog = message.guild.channels.cache.get(context.canalBan);
                        if (canalLog) {
                            const embed = new EmbedBuilder()
                                .setTitle("🚫 Jogador banido")
                                .setDescription(`O Feiticeiro **${nome}** foi morto no jogo do abate.\n📄 Motivo: ${motivo}`)
                                .setColor(0xED4245);
                            canalLog.send({ embeds: [embed] });
                        }

                    } catch (err) {
                        console.error(err);
                        return message.reply("❌ Erro ao banir do servidor.");
                    }
                }

                if (context.tipoBan === "makyo") {
                    context.banidosMakyo.push({ id, nome, motivo });
                }

                context.esperandoBan = null;
                context.etapaBan = null;
                context.tempBan = null;
                context.tipoBan = null;

                await context.salvarDados();
                return message.reply(`✅ Jogador ${nome} banido. Motivo: "${motivo}"`);
            }
        }

        // ---------- DESBAN MAKYO ----------
        if (context.esperandoUnban === message.author.id) {
            const mention = message.mentions.members.first();
            if (!mention) return message.reply("❌ Marque um jogador válido.");

            const id = mention.id;
            const antes = context.banidosMakyo.length;
            context.banidosMakyo = context.banidosMakyo.filter(p => p.id !== id);

            if (context.banidosMakyo.length === antes) {
                return message.reply("❌ Esse jogador não está banido.");
            }

            await context.salvarDados();
            context.esperandoUnban = null;
            return message.reply("✅ Jogador desbanido do Makyo.");
        }

        // ---------- BLACKLIST ----------
        if (context.esperandoBlacklist === message.author.id) {
            const content = message.content.trim();

            if (context.etapaBlacklist === "id") {
                if (!/^\d{15}$/.test(content)) return message.reply("❌ ID inválido. Deve ter 15 números.");
                context.tempBlacklist.id = content;
                context.etapaBlacklist = "nome";
                return message.reply("✏️ Agora digite o nick.");
            }

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