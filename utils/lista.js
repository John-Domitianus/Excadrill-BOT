const { EmbedBuilder } = require("discord.js");
const dataManager = require("../services/dataManager"); // ajuste caminho

function atualizarListaCompleta(client, filaCFK, filaCFK100) {
    const canalFila = dataManager.getCanalFila();
    const mensagemId = dataManager.getMensagemFila();
    if (!canalFila || !mensagemId) return;

    const canal = client.channels.cache.get(canalFila);
    if (!canal) return;

    const listaCFK = filaCFK.length === 0
        ? "Nenhum jogador."
        : filaCFK.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n");

    const listaCFK100 = filaCFK100.length === 0
        ? "Nenhum jogador."
        : filaCFK100.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n");

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("📋 Lista Oficial - Filas Makyo")
        .addFields(
            { name: "🎯 Makyo Normal", value: listaCFK },
            { name: "🔥 Makyo Avançado", value: listaCFK100 }
        );

    // Edita a mensagem âncora
    canal.messages.fetch(mensagemId)
        .then(msg => msg.edit({ embeds: [embed] }))
        .catch(() => console.log("⚠️ Mensagem da lista não encontrada."));
}
module.exports = { atualizarListaCompleta };

function atualizarListaGuerra(client, canalFilaCompleta, filaGuerra, mensagemGuerra) {
    if (!canalFilaCompleta) return;
    const canal = client.channels.cache.get(canalFilaCompleta);
    if (!canal) return;

    const titulares = filaGuerra.filter(p => p.tipo === "titular");
    const reservas = filaGuerra.filter(p => p.tipo === "reserva");

    const listaTitulares = titulares.length === 0
        ? "Nenhum jogador."
        : titulares.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n");

    const listaReservas = reservas.length === 0
        ? "Nenhum jogador."
        : reservas.map((p, i) => `**${i + 1}.** ${p.nome} | ${p.hora}`).join("\n");

    const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("📋 Lista Oficial - Guerra")
        .addFields(
            { name: "🛡️ Titulares", value: listaTitulares },
            { name: "🎯 Reservas", value: listaReservas }
        );

    if (mensagemGuerra) {
        mensagemGuerra.edit({ embeds: [embed] }).catch(() => { mensagemGuerra = null; });
    } else {
        canal.send({ embeds: [embed] }).then(msg => mensagemGuerra = msg);
    }

    return mensagemGuerra;
}

module.exports = { atualizarListaCompleta, atualizarListaGuerra };