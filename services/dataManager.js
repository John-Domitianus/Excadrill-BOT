const mongoose = require("mongoose");

const DadosSchema = new mongoose.Schema({
    canalPyaku: String,
    canalFilaCompleta: String,
    canalBan: String,

    controleDiario: Object,

    filaCFK: Array,
    filaCFK100: Array,

    // ===== TORNEIO =====
    filaSingle: Array,
    filaDouble: Array,

    partidasSingle: Array,
    partidasDouble: Array,

    torneio: Object,

    // ===== ANTIGO =====
    filaGuerra: Array,

    banidosMakyo: Array,
    listaNegra: Array
});

const Dados = mongoose.model("Dados", DadosSchema);

let canalPyaku = null;
let canalFilaCompleta = null;
let canalBan = null;

let controleDiario = {};

let filaCFK = [];
let filaCFK100 = [];

// ===== TORNEIO =====
let filaSingle = [];
let filaDouble = [];

let partidasSingle = [];
let partidasDouble = [];

let torneio = {
    single: {
        aberto: true,
        sorteado: false
    },
    double: {
        aberto: true,
        sorteado: false
    }
};

// ===== ANTIGO =====
let filaGuerra = [];

let banidosMakyo = [];
let listaNegra = [];
let dadosCarregados = false;

async function carregarDadosMongo() {

    const dados = await Dados.findOne();

    if (dados) {

        canalPyaku = dados.canalPyaku;
        canalFilaCompleta = dados.canalFilaCompleta;
        canalBan = dados.canalBan;

        Object.assign(controleDiario, dados.controleDiario || {});

        filaCFK.push(...(dados.filaCFK || []));
        filaCFK100.push(...(dados.filaCFK100 || []));

        filaSingle.push(...(dados.filaSingle || []));
        filaDouble.push(...(dados.filaDouble || []));

        partidasSingle.push(...(dados.partidasSingle || []));
        partidasDouble.push(...(dados.partidasDouble || []));

        if (dados.torneio) {
            torneio = dados.torneio;
        }

        filaGuerra.push(...(dados.filaGuerra || []));

        banidosMakyo.push(...(dados.banidosMakyo || []));
        listaNegra.push(...(dados.listaNegra || []));
    }

    dadosCarregados = true;
}

async function salvarDados() {

    await Dados.findOneAndUpdate({}, {

        canalPyaku,
        canalFilaCompleta,
        canalBan,

        controleDiario,

        filaCFK,
        filaCFK100,

        // ===== TORNEIO =====
        filaSingle,
        filaDouble,

        partidasSingle,
        partidasDouble,

        torneio,

        // ===== ANTIGO =====
        filaGuerra,

        banidosMakyo,
        listaNegra

    }, { upsert: true });

}

function resetDiario() {
    controleDiario = {};
}

function setCanalBan(id) {
    canalBan = id;
}

function getCanalBan() {
    return canalBan;
}

function setCanalFilaCompleta(id) {
    canalFilaCompleta = id;
}

function getCanalFilaCompleta() {
    return canalFilaCompleta;
}

module.exports = {

    canalPyaku,
    canalFilaCompleta,
    canalBan,

    setCanalBan,
    getCanalBan,

    setCanalFilaCompleta,
    getCanalFilaCompleta,

    controleDiario,

    filaCFK,
    filaCFK100,

    // ===== TORNEIO =====
    filaSingle,
    filaDouble,

    partidasSingle,
    partidasDouble,

    torneio,

    // ===== ANTIGO =====
    filaGuerra,

    banidosMakyo,

    dadosCarregados,

    carregarDadosMongo,
    salvarDados,

    resetDiario,

    listaNegra
};