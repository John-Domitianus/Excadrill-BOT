const { PermissionsBitField, EmbedBuilder } = require("discord.js");
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

// VARIAVEIS DE CONTROLE
let esperandoNick = null;
let esperandoBan = null;
let esperandoUnban = null;
let esperandoBlacklist = null;
let etapaBlacklist = null;
let tempBlacklist = null;



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

        // ======= MENÇÃO AO BOT =======
        const botMention = `<@${client.user.id}>`;
        const botNicknameMention = `<@!${client.user.id}>`; // em alguns casos aparece assim
        if (
            (message.content === botMention || message.content === botNicknameMention)
        ) {
            const embed = new EmbedBuilder()
                .setTitle("🤖 Olá! Eu sou o Pyaku, o BOT personalizado da Escola Jujutsu Ragnarok!")
                .setDescription(
                    "Aqui estão os comandos que você pode usar:\n" +
                    "• `!nick` — Alterar seu nick\n" +
                    "• `!makyo` — Comandos relacionados ao Makyo\n" +
                    "• `!guerra` — Comandos relacionados à Guerra\n" +
                    "• `!admin` — Painel de administração (somente para admins)\n\n"
                 )
                .setColor(0x00FFFF)
                .setFooter({ text: "Desenvolvido por: Sushi!" });

            return message.reply({ embeds: [embed] });
        }

        // contexto compartilhado para todos os comandos
        const context = {
            esperandoNick,
            esperandoBan,
            esperandoUnban,
            esperandoBlacklist,
            etapaBlacklist,
            tempBlacklist,
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
            "../commands/setban",
            "../commands/setfila",
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
        esperandoBlacklist = context.esperandoBlacklist;
        etapaBlacklist = context.etapaBlacklist;
        tempBlacklist = context.tempBlacklist;
    });
};