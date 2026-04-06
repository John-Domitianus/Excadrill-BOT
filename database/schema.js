const mongoose = require("mongoose");

const DadosSchema = new mongoose.Schema({
    canalPyaku: String,
    canalFilaCompleta: String,
    controleDiario: Object,
    filaCFK: Array,
    filaCFK100: Array,
    filaGuerra: Array,
    banidosMakyo: Array,
    listaNegra: Array
});

module.exports = mongoose.model("Dados", DadosSchema);