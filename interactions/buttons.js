const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { embedErro, embedSucesso } = require("./utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("./utils/lista");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("./config/constants");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

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
            return interaction.update({
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
            const i1 = context.filaCFK.findIndex(p => p.nome === nome);
            const i2 = context.filaCFK100.findIndex(p => p.nome === nome);
            if (i1 !== -1) context.filaCFK.splice(i1, 1);
            if (i2 !== -1) context.filaCFK100.splice(i2, 1);
            await context.salvarDados();
            atualizarListaCompleta(client);
            return sucesso("Saiu da fila.");

        // ================= GUERRA =================
        case "abrir_guerra":
            return interaction.update({
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
            return interaction.update({
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
            const titulares = context.filaGuerra.filter(p => p.tipo === "titular");
            const reservas = context.filaGuerra.filter(p => p.tipo === "reserva");

            const listaTitulares = titulares.length ? titulares.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n") : "Nenhum jogador.";
            const listaReservas = reservas.length ? reservas.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n") : "Nenhum jogador.";

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle("📋 Lista Oficial - Guerra")
                        .addFields(
                            { name: "🛡️ Titulares", value: listaTitulares },
                            { name: "🎯 Reservas", value: listaReservas }
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
            // Aqui você integra a lógica de admin diretamente
            require("./adminButtons")(interaction, context, client);
            break;

        default:
            return erro("Botão não reconhecido.");
    }
};