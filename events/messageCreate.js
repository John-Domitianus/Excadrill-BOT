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

        // comando de teste rápido
        if (message.content === "!ping") {
            return message.reply("Pong!");
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

        // lista de comandos
        const comandos = [
            "../commands/nick",
            "../commands/makyo",
            "../commands/guerra",
            "../commands/admin"
        ];

        for (const cmdPath of comandos) {
            try {
                const comando = require(cmdPath);
                if (comando && typeof comando === "function") {
                    await comando(message, context);
                } else if (comando && comando.execute) {
                    await comando.execute(message, context);
                }
            } catch (err) {
                console.warn(`⚠️ Comando não encontrado ou com erro: ${cmdPath}`);
            }
        }

        // atualizar variáveis externas caso tenham sido alteradas nos comandos
        esperandoNick = context.esperandoNick;
        esperandoBan = context.esperandoBan;
        esperandoUnban = context.esperandoUnban;
    });
};