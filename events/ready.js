const { carregarDadosMongo } = require("../services/dataManager");

module.exports = async (client) => {
    client.on("ready", async () => {
        console.log(`${client.user.tag} Online!`);
        await carregarDadosMongo();
    });
};