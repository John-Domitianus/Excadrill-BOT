const mongoose = require("mongoose");

// Modelo MongoDB
const DadosSchema = new mongoose.Schema({
    filaCFK: Array,
    filaCFK100: Array,
    filaGuerra: Array,
    controleDiario: Object,
    banidosMakyo: Array,
    ultimaAtualizacao: String
});

const Dados = mongoose.model("Dados", DadosSchema);

// Estado em memória
let filaCFK = [];
let filaCFK100 = [];
let filaGuerra = [];
let controleDiario = {};
let banidosMakyo = [];
let dadosCarregados = false;

// Carregar dados do MongoDB
async function carregarDadosMongo() {
    try {
        const doc = await Dados.findOne({});
        if (doc) {
            filaCFK = doc.filaCFK || [];
            filaCFK100 = doc.filaCFK100 || [];
            filaGuerra = doc.filaGuerra || [];
            controleDiario = doc.controleDiario || {};
            banidosMakyo = doc.banidosMakyo || [];
        } else {
            await new Dados({}).save();
        }
        dadosCarregados = true;
        console.log("[DataManager] Dados carregados com sucesso.");
    } catch (err) {
        console.error("[DataManager] Erro ao carregar dados:", err);
    }
}

// Salvar dados no MongoDB
async function salvarDados() {
    try {
        await Dados.updateOne({}, {
            filaCFK,
            filaCFK100,
            filaGuerra,
            controleDiario,
            banidosMakyo,
            ultimaAtualizacao: new Date().toISOString()
        }, { upsert: true });
        console.log("[DataManager] Dados salvos.");
    } catch (err) {
        console.error("[DataManager] Erro ao salvar dados:", err);
    }
}

// Reset diário
function resetDiario() {
    controleDiario = {};
}

// Exportando tudo em um objeto único de contexto
module.exports = {
    filaCFK,
    filaCFK100,
    filaGuerra,
    controleDiario,
    banidosMakyo,
    dadosCarregados,
    carregarDadosMongo,
    salvarDados,
    resetDiario
};