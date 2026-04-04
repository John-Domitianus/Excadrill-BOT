// index.js
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Serviços e utilitários
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

// Função principal assíncrona para inicializar bot e carregar dados
(async () => {
    try {
        // Carrega dados do MongoDB
        await dataManager.carregarDadosMongo();

        // Contexto compartilhado
        const context = {
            client,
            ...dataManager
        };

        // Eventos
        require("./events/ready")(client, context);
        require("./events/messageCreate")(client, context);

        // Interações de botões
        require("./interactions/buttons")(client, context);

        console.log("✅ Bot e contexto inicializados com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao iniciar o bot:", err);
    }
})();

// Login do bot
client.login(process.env.TOKEN);