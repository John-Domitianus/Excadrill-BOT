const { PermissionsBitField } = require("discord.js");
const { embedSucesso, embedErro } = require("../utils/embeds");
const {
    canalPyaku,
    canalFilaCompleta,
    dadosCarregados,
    salvarDados,
    controleDiario,
    filaCFK,
    filaCFK100,
    filaGuerra,
    banidosMakyo
} = require("../services/dataManager");
const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");
const { limiteCFK, limiteCFK100, limiteTitular, limiteReserva } = require("../config/constants");

let esperandoNick = null;
let esperandoBan = null;
let esperandoUnban = null;

function hoje() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function pegarHorario() {
    const agora = new Date();
    return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

module.exports = (client) => {
    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        if (message.content === "!ping") {
            message.reply("Pong!");
        }
    
        // contexto compartilhado para todos os comandos
        const context = {
            esperandoNick,
            esperandoBan,
            esperandoUnban,
            canalPyaku,
            canalFilaCompleta,
            filaCFK,
            filaCFK100,
            filaGuerra,
            banidosMakyo,
            controleDiario,
            salvarDados,
            hoje,
            pegarHorario,
            atualizarListaCompleta,
            atualizarListaGuerra
        };

        // importar os comandos
        const nickCommand = require("../commands/nick");
        const makyoCommand = require("../commands/makyo");
        const guerraCommand = require("../commands/guerra");
        const adminCommand = require("../commands/admin");
        const canalCommand = require("../commands/canal");
        const filaCommand = require("../commands/fila");

        // executar os comandos
        await nickCommand(message, context);
        await makyoCommand(message, context);
        await guerraCommand(message, context);
        await adminCommand(message, context);
        await canalCommand(message, context);
        await filaCommand(message, context);

        // atualizar variáveis externas caso tenham sido alteradas nos comandos
        esperandoNick = context.esperandoNick;
        esperandoBan = context.esperandoBan;
        esperandoUnban = context.esperandoUnban;
    });
};
