// index.js//
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
        // Login do bot
        await client.login(process.env.TOKEN);

        // Cria contexto compartilhado
        const context = {
            client,
            ...dataManager,
            dadosCarregados: false
        };

        // Carrega dados do MongoDB
        await dataManager.carregarDadosMongo();
        context.dadosCarregados = true;

        // Registra eventos
        require("./events/ready")(client, context);
        require("./events/messageCreate")(client, context);
        require("./interactions/buttons")(client, context);
        
        

        console.log("✅ Bot e contexto inicializados com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao iniciar o bot:", err);
    }
})();