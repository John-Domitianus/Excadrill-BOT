const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const { embedErro, embedSucesso } = require("./utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("./utils/lista");
const {
    limiteCFK,
    limiteCFK100,
    limiteTitular,
    limiteReserva
} = require("./config/constants");

module.exports = async (interaction, context, client) => {
    if (!context.dadosCarregados) return;
    if (!interaction.isButton()) return;

    const nome = interaction.member.displayName;
    const hora = pegarHorario();
    const erro = (msg) => interaction.reply({ embeds: [embedErro(msg)], ephemeral: true });
    const sucesso = (msg) => interaction.reply({ embeds: [embedSucesso(msg)], ephemeral: true });

    if (context.banidosMakyo.includes(nome)) return erro("Você está banido dos Makyo's.");

    switch (interaction.customId) {
        // ================= MAKYO =================
        case "abrir_makyo":
            return interaction.update({
                embeds: [{ title: "Escolha o Makyo" }],
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
            return interaction.update({
                embeds: [{ title: "🎯 Painel Makyo" }],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("abrir_makyo").setLabel("Entrar Makyo").setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId("ver_vagas").setLabel("Ver vagas").setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId("sair_fila").setLabel("Sair").setStyle(ButtonStyle.Danger)
                    )
                ]
            });

        case "makyo_normal":
            if (context.controleDiario[nome] === hoje()) return erro("Você já participou de um Makyo hoje.");
            if (context.filaCFK.find(p => p.nome === nome)) return erro("Já está na fila.");
            if (context.filaCFK.length >= limiteCFK) return erro("Fila cheia.");

            context.filaCFK.push({ nome, hora });
            context.controleDiario[nome] = hoje();
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Entrou no Makyo Normal.");

        case "makyo_100":
            if (context.controleDiario[nome] === hoje()) return erro("Você já participou de um Makyo hoje.");
            if (context.filaCFK100.find(p => p.nome === nome)) return erro("Já está na fila.");
            if (context.filaCFK100.length >= limiteCFK100) return erro("Fila cheia.");

            context.filaCFK100.push({ nome, hora });
            context.controleDiario[nome] = hoje();
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Entrou no Makyo Avançado.");

        case "ver_vagas":
            return sucesso(`Makyo: ${context.filaCFK.length}/${limiteCFK}\nMakyo Avançado: ${context.filaCFK100.length}/${limiteCFK100}`);

        case "sair_fila":
            removeDaFila(context.filaCFK, nome);
            removeDaFila(context.filaCFK100, nome);
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Saiu da fila.");

        // ================= GUERRA =================
        case "abrir_guerra":
            return interaction.update({
                embeds: [{ title: "⚔️ Escolha posição" }],
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
            return interaction.update({
                embeds: [{ title: "⚔️ Painel Guerra" }],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("abrir_guerra").setLabel("Entrar Guerra").setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId("ver_guerra").setLabel("Ver lista").setStyle(ButtonStyle.Secondary)
                    )
                ]
            });

        case "titular":
            if (context.filaGuerra.find(p => p.nome === nome)) return erro("Já está na guerra.");
            if (context.filaGuerra.length >= limiteTitular) return erro("Titulares cheios.");
            context.filaGuerra.push({ nome, hora, tipo: "titular" });
            await context.salvarDados();
            atualizarListaGuerra(client);
            return sucesso("Entrou como titular.");

        case "reserva":
            if (context.filaGuerra.find(p => p.nome === nome)) return erro("Já está na guerra.");
            if (context.filaGuerra.length >= limiteTitular + limiteReserva) return erro("Reservas cheios.");
            context.filaGuerra.push({ nome, hora, tipo: "reserva" });
            await context.salvarDados();
            atualizarListaGuerra(client);
            return sucesso("Entrou como reserva.");

        case "ver_guerra":
            return exibirGuerra(context, interaction);

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
            return adminButtons(interaction, context, client);

        default:
            return erro("Botão não reconhecido.");
    }

    function hoje() {
        const d = new Date();
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    function pegarHorario() {
        const agora = new Date();
        return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    }

    function removeDaFila(fila, nome) {
        const index = fila.findIndex(p => p.nome === nome);
        if (index !== -1) fila.splice(index, 1);
    }

    function exibirGuerra(context, interaction) {
        const titulares = context.filaGuerra.filter(p => p.tipo === "titular");
        const reservas = context.filaGuerra.filter(p => p.tipo === "reserva");

        const listaTitulares = titulares.length
            ? titulares.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n")
            : "Nenhum jogador.";
        const listaReservas = reservas.length
            ? reservas.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n")
            : "Nenhum jogador.";

        return interaction.reply({
            embeds: [
                {
                    color: 0xED4245,
                    title: "📋 Lista Oficial - Guerra",
                    fields: [
                        { name: "🛡️ Titulares", value: listaTitulares },
                        { name: "🎯 Reservas", value: listaReservas }
                    ]
                }
            ],
            ephemeral: true
        });
    }

    async function adminButtons(interaction, context, client) {
        const id = interaction.customId;
        const nomeUser = interaction.member.displayName;

        const hasAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!hasAdmin) return erro("Sem permissão.");

        switch (id) {
            case "admin_makyo":
                return interaction.update({
                    embeds: [{ title: "🛠️ Admin Makyo", description: "Controle total do Makyo" }],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId("reset_cfk").setLabel("Reset Makyo").setStyle(ButtonStyle.Danger),
                            new ButtonBuilder().setCustomId("reset_cfk100").setLabel("Reset Makyo Avançado").setStyle(ButtonStyle.Danger)
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
                    embeds: [{ title: "🛠️ Admin Guerra" }],
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
                    embeds: [{ title: "🛠️ Admin" }],
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
                return sucesso("Marque o jogador que deseja banir.");

            case "desbanir_membro":
                context.esperandoUnban = interaction.user.id;
                await context.salvarDados();
                return sucesso("Marque o jogador que deseja desbanir.");

            case "ver_banidos":
                const listaBanidos = context.banidosMakyo.length ? context.banidosMakyo.join("\n") : "Nenhum jogador banido.";
                return interaction.reply({ embeds: [{ color: 0xED4245, title: "🚫 Jogadores Banidos", description: listaBanidos }], ephemeral: true });

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
    }
};