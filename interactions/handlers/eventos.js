const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require("discord.js");
const { embedErro, embedSucesso } = require("../../utils/embeds");
const { atualizarListaCompleta } = require("../../utils/lista");
const { limiteCFK, limiteCFK100 } = require("../../config/constants");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

module.exports = async (interaction, context) => {

    const id = interaction.customId;

    const isEventos =
        id === "abrir_eventos" ||
        id === "voltar_eventos" ||
        id === "evento_normal" ||
        id === "evento_avancado" ||
        id === "ver_vagas" ||
        id === "sair_fila";

    if (!isEventos) return false;

    const nome = interaction.member.displayName;
    const hora = pegarHorario();

    const erro = (msg) =>
        interaction.followUp({ embeds: [embedErro(msg)], ephemeral: true });

    const sucesso = (msg) =>
        interaction.followUp({ embeds: [embedSucesso(msg)], ephemeral: true });

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
    }

    if (context.banidosMakyo?.some(p => p.id === interaction.user.id)) {
        await erro("Você está banido dos eventos.");
        return true;
    }

    switch (id) {

        case "abrir_eventos":
            return interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("🎯 Eventos")],
                components: [
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("select_lista_eventos")
                            .setPlaceholder("Escolha o evento...")
                            .addOptions(
                                {
                                    label: "Evento Comum",
                                    value: "comum"
                                },
                                {
                                    label: "Evento Especial",
                                    value: "especial"
                                }
                            )
                    )
                ]
            });

        case "voltar_eventos":
            return interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("🎯 Painel Eventos")],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("abrir_eventos")
                            .setLabel("Entrar")
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId("ver_vagas")
                            .setLabel("Ver Eventos")
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId("sair_fila")
                            .setLabel("Sair")
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });

        case "evento_normal":
            if (context.controleDiario[nome] === hoje())
                return erro("Você já participou hoje.");

            if (context.filaCFK.find(p => p.nome === nome))
                return erro("Já está no evento.");

            if (context.filaCFK.length >= limiteCFK)
                return erro("Fila cheia.");

            context.filaCFK.push({ nome, hora });
            context.controleDiario[nome] = hoje();

            await context.salvarDados();
            atualizarListaCompleta(context.client);

            return sucesso("Entrou no evento normal.");

        case "evento_avancado":
            if (context.controleDiario[nome] === hoje())
                return erro("Você já participou hoje.");

            if (context.filaCFK100.find(p => p.nome === nome))
                return erro("Já está no evento.");

            if (context.filaCFK100.length >= limiteCFK100)
                return erro("Fila cheia.");

            context.filaCFK100.push({ nome, hora });
            context.controleDiario[nome] = hoje();

            await context.salvarDados();
            atualizarListaCompleta(context.client);

            return sucesso("Entrou no evento avançado.");

        case "ver_vagas":
            return interaction.followUp({
                content: "📊 Selecione o tipo de evento:",
                components: [
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("select_lista_eventos")
                            .setPlaceholder("Escolha o evento...")
                            .addOptions(
                                {
                                    label: "Evento Comum",
                                    value: "comum"
                                },
                                {
                                    label: "Evento Especial",
                                    value: "especial"
                                }
                            )
                    )
                ],
                ephemeral: true
            });

        case "sair_fila":
            context.filaCFK = context.filaCFK.filter(p => p.nome !== nome);
            context.filaCFK100 = context.filaCFK100.filter(p => p.nome !== nome);

            await context.salvarDados();
            atualizarListaCompleta(context.client);

            return sucesso("Saiu do evento.");
    }

    return false;
};