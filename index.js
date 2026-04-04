// index.js
global.rootDir = __dirname;
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const dataManager = require("./services/dataManager");

// Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Conexão MongoDB
require("./database/connect")();

(async () => {
    try {
        await dataManager.carregarDadosMongo();

        const context = {
            client,
            ...dataManager
        };

        require("./events/ready")(client, context);
        require("./events/messageCreate")(client, context);
        require("./interactions/buttons")(client, context);

        console.log("✅ Bot e contexto inicializados com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao iniciar o bot:", err);
    }
})();

client.login(process.env.TOKEN);