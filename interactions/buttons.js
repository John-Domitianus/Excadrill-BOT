const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");
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

        if (!interaction.isButton()) return;

        console.log("BOTÃO:", interaction.customId);

        try {
            await interaction.reply({
                content: "Botão funcionando",
                ephemeral: true
            });
        } catch (err) {
            console.error("ERRO NA INTERAÇÃO:", err);
        }

    });
};