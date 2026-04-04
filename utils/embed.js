const { EmbedBuilder } = require("discord.js");

function embedSucesso(msg) {
    return new EmbedBuilder().setColor(0x57F287).setDescription(`✅ ${msg}`);
}

function embedErro(msg) {
    return new EmbedBuilder().setColor(0xED4245).setDescription(`❌ ${msg}`);
}

function embedInfo(msg) {
    return new EmbedBuilder().setColor(0x5865F2).setDescription(`ℹ️ ${msg}`);
}

module.exports = { embedSucesso, embedErro, embedInfo };