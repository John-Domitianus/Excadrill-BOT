const mongoose = require("mongoose");

const DadosSchema = new mongoose.Schema({
    canalPyaku: String,
    canalFilaCompleta: String,
    controleDiario: Object,
    filaCFK: Array,
    filaCFK100: Array,
    filaGuerra: Array,
    banidosMakyo: Array
});

const Dados = mongoose.model("Dados", DadosSchema);

let canalPyaku = null;
let canalFilaCompleta = null;
let controleDiario = {};
let filaCFK = [];
let filaCFK100 = [];
let filaGuerra = [];
let banidosMakyo = [];
let listaNegra = [];
let dadosCarregados = false;

async function carregarDadosMongo() {
    const dados = await Dados.findOne();
    if (dados) {
        canalPyaku = dados.canalPyaku;
        canalFilaCompleta = dados.canalFilaCompleta;
        Object.assign(controleDiario, dados.controleDiario || {});
        filaCFK.push(...(dados.filaCFK || []));
        filaCFK100.push(...(dados.filaCFK100 || []));
        filaGuerra.push(...(dados.filaGuerra || []));
        banidosMakyo.push(...(dados.banidosMakyo || []));
        listaNegra.push(...(dados.listaNegra || []));
    }
    console.log("Blacklist:", listaNegra); //Para verificar carregamento de DataBase
    dadosCarregados = true;
}

async function salvarDados() {
    await Dados.findOneAndUpdate({}, {
        canalPyaku,
        canalFilaCompleta,
        controleDiario,
        filaCFK,
        filaCFK100,
        filaGuerra,
        banidosMakyo,
        listaNegra
    }, { upsert: true });
}

function resetDiario() {
    controleDiario = {};
}

module.exports = {
    canalPyaku,
    canalFilaCompleta,
    controleDiario,
    filaCFK,
    filaCFK100,
    filaGuerra,
    banidosMakyo,
    dadosCarregados,
    carregarDadosMongo,
    salvarDados,
    resetDiario,
    listaNegra
};