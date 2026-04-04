const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { embedErro, embedSucesso } = require("../utils/embeds");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("../config/constants");

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
        console.log("INTERACTION GLOBAL:", interaction.customId);

        if (!interaction.isButton()) return;

        await interaction.reply({
            content: "Teste global OK",
            ephemeral: true
        });
    }); };