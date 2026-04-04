const Dados = require("../database/schema");

const controleDiario = {};
const filaCFK = [];
const filaCFK100 = [];
const filaGuerra = [];
const banidosMakyo = [];

let canalPyaku = null;
let canalFilaCompleta = null;
let dadosCarregados = false;

async function carregarDadosMongo() {
    const dados = await Dados.findOne();
    if (!dados) return;

    canalPyaku = dados.canalPyaku || null;
    canalFilaCompleta = dados.canalFilaCompleta || null;

    Object.assign(controleDiario, dados.controleDiario || {});

    filaCFK.push(...(dados.filaCFK || []));
    filaCFK100.push(...(dados.filaCFK100 || []));
    filaGuerra.push(...(dados.filaGuerra || []));
    banidosMakyo.push(...(dados.banidosMakyo || []));

    dadosCarregados = true;
    console.log("📥 Dados carregados do MongoDB");
}

async function salvarDados() {
    if (!dadosCarregados) return;

    await Dados.findOneAndUpdate(
        {},
        {
            canalPyaku,
            canalFilaCompleta,
            controleDiario,
            filaCFK,
            filaCFK100,
            filaGuerra,
            banidosMakyo
        },
        { upsert: true }
    );
    console.log("💾 Dados salvos no MongoDB");
}

module.exports = {
    controleDiario,
    filaCFK,
    filaCFK100,
    filaGuerra,
    banidosMakyo,
    canalPyaku,
    canalFilaCompleta,
    dadosCarregados,
    carregarDadosMongo,
    salvarDados
};