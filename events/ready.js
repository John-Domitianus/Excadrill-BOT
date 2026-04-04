const { carregarDadosMongo } = require("../services/dataManager");
const fs = require("fs");

console.log("DIR:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));
console.log("SERVICES EXISTS:", fs.existsSync(__dirname + "/../services"));

module.exports = async (client, context) => {
    client.on("ready", async () => {  // CORRIGIDO
        console.log(`${client.user.tag} Online!`);
        //await context.carregarDadosMongo();  // use o context já passado
        //context.dadosCarregados = true;      // marca como pronto
    });
};