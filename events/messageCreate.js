const { EmbedBuilder } = require("discord.js");
const path = require("path");

// comandos (carregados uma vez só)
const nickCmd = require("../commands/nick");
const makyoCmd = require("../commands/makyo");
const guerraCmd = require("../commands/guerra");
const adminCmd = require("../commands/admin");

const {
    salvarDados,
    controleDiario,
    filaCFK,
    filaCFK100,
    filaGuerra,
    banidosMakyo
} = require("../services/dataManager");

const { atualizarListaCompleta, atualizarListaGuerra } = require("../utils/lista");

// ===== CONTROLE =====
let esperandoNick = null;
let esperandoBan = null;
let esperandoUnban = null;
let esperandoBlacklist = null;
let etapaBlacklist = null;
let tempBlacklist = null;
let fluxoNick = {};

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

        const content = message.content.trim();

        // ===== CONTEXTO =====
        const context = {
            fluxoNick,
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
                await nickCmd(message, context);
            }

            else if (lower.startsWith("!makyo")) {
                await makyoCmd(message, context);
            }

            else if (lower.startsWith("!guerra")) {
                await guerraCmd(message, context);
            }

            else if (lower.startsWith("!admin")) {
                await adminCmd(message, context);
            }

            // ===== FLUXOS (mensagens sem comando) =====
            else if (
                fluxoNick[message.author.id] ||
                esperandoNick === message.author.id
            ) {
                await nickCmd(message, context);
            }

        } catch (err) {
            console.error("❌ Erro ao executar comando:", err);
        }

        // ===== ATUALIZA CONTROLE =====
        esperandoNick = context.esperandoNick;
        esperandoBan = context.esperandoBan;
        esperandoUnban = context.esperandoUnban;
        esperandoBlacklist = context.esperandoBlacklist;
        etapaBlacklist = context.etapaBlacklist;
        tempBlacklist = context.tempBlacklist;
        fluxoNick = context.fluxoNick;
    });
};