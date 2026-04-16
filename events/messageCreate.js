const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const path = require("path");

// comandos (carregados uma vez só)
const nickCmd = require("../commands/nick");
const makyoCmd = require("../commands/makyo");
const guerraCmd = require("../commands/guerra");
const adminCmd = require("../commands/admin");
const setfilaCmd = require("../commands/setfila");
const setbanCmd = require("../commands/setban");

const {
    salvarDados,
    controleDiario,
    filaCFK,
    filaCFK100,
    filaGuerra,
    banidosMakyo
} = require("../services/dataManager");

const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");

// 🔒 ADICIONADO (mantido, mas não usado mais no bloqueio)
const data = require("../services/dataManager");

// ===== CONTROLE =====
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

module.exports = (client, context) => {
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;

        // 🔒 BLOQUEIO APENAS PARA COMANDOS DO BOT
        const comandoNome = message.content.startsWith("!")
            ? message.content.slice(1).split(" ")[0].toLowerCase()
            : null;

        if (
            comandoNome &&
            context.comandos &&
            context.comandos[comandoNome] && // 🔥 só comandos existentes
            comandoNome !== "setfila" &&
            context.getCanalFilaCompleta &&
            context.getCanalFilaCompleta() &&
            message.channel.id !== context.getCanalFilaCompleta()
        ) {
            const canalCorreto = context.getCanalFilaCompleta();

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("❌ Canal incorreto")
                .setDescription(`Use os comandos apenas no canal <#${canalCorreto}>.`)
                .setFooter({ text: "Sistema de Filas" });

            return message.reply({ embeds: [embed] });
        }        
        
        const content = message.content.trim();

        // ===== CONTEXTO LOCAL =====
        const localContext = {
            fluxoNick: context.fluxoNick,
            esperandoNick,
            esperandoBan,
            esperandoUnban,
            esperandoBlacklist,
            etapaBlacklist,
            tempBlacklist,
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

        const lower = content.toLowerCase();

        try {
            // ===== COMANDOS =====
            if (lower.startsWith("!nick")) {
                await nickCmd(message, localContext);
            }

            else if (lower.startsWith("!makyo")) {
                await makyoCmd(message, localContext);
            }

            else if (lower.startsWith("!guerra")) {
                await guerraCmd(message, localContext);
            }

            else if (lower.startsWith("!admin")) {
                await adminCmd(message, localContext);
            }

            else if (lower.startsWith("!setfila")) {
                await setfilaCmd(message, localContext);
            }
            else if (lower.startsWith("!setban")) {
                await setbanCmd(message, context);
            }

            // ===== FLUXOS =====
            else if (
                context.fluxoNick[message.author.id] ||
                esperandoNick === message.author.id
            ) {
                await nickCmd(message, localContext);
            }

        } catch (err) {
            console.error("❌ Erro ao executar comando:", err);
        }

        // ===== ATUALIZA CONTROLE =====
        esperandoNick = localContext.esperandoNick;
        esperandoBan = localContext.esperandoBan;
        esperandoUnban = localContext.esperandoUnban;
        esperandoBlacklist = localContext.esperandoBlacklist;
        etapaBlacklist = localContext.etapaBlacklist;
        tempBlacklist = localContext.tempBlacklist;
    });
};