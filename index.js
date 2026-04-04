const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Conexão Mongo
require("./database/connect")();

// Eventos
require("./events/ready")(client);
require("./events/messageCreate")(client);

// Interações de botões
require("./interactions/buttons")(client);

client.login(process.env.TOKEN);