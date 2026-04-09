const { carregarDadosMongo } = require("../services/dataManager");
const fs = require("fs");


module.exports = async (client, context) => {
    client.on("ClientReady", async () => {  // CORRIGIDO
        //await context.carregarDadosMongo();  // use o context ja passado
        //context.dadosCarregados = true;      // marca como pronto
    });
};