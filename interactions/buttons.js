const { embedSucesso, embedErro } = require("../utils/embeds");
const { filaCFK, filaCFK100, filaGuerra, banidosMakyo, controleDiario, salvarDados } = require("../services/dataManager");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("../config/constants");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        const nome = interaction.member.displayName;
        const hora = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

        const erro = (msg) => interaction.reply({ embeds: [embedErro(msg)], ephemeral: true });
        const sucesso = (msg) => interaction.reply({ embeds: [embedSucesso(msg)], ephemeral: true });

        if (banidosMakyo.includes(nome)) return erro("Você está banido.");

        // Aqui você pode modularizar o switch case em funções separadas por categoria (makyo, guerra, admin)
    });
};