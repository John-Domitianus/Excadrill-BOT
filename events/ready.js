const { carregarDadosMongo } = require("../services/dataManager");
const fs = require("fs");

console.log("DIR:", __dirname);
console.log("FILES:", fs.readdirSync(__dirname));
console.log("SERVICES EXISTS:", fs.existsSync(__dirname + "/../services"));

module.exports = async (client) => {
    client.on("ready", async () => {
        console.log(`${client.user.tag} Online!`);
        await carregarDadosMongo();
    });
};